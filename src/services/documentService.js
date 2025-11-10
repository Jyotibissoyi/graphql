import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import prisma from "../config/prisma.js";
import { sendDocumentEmail } from "./emailService.js";

const __dirname = process.cwd();

const UPLOAD_DIR = path.join(__dirname, "src", "uploads", "documents");
await fs.ensureDir(UPLOAD_DIR);

// Helper: format JSON nicely in template
Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context, null, 2);
});

export async function createDocument({ title, templateData }) {
    // 1️⃣ Load and render HTML with Handlebars
    const templatePath = path.join(__dirname, "src", "templates", "document", "basic.hbs");
    const templateSource = await fs.readFile(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);

    console.log(templateData, "templateData")
    const html = template({
        title,
        templateData,
        createdAt: new Date().toLocaleString(),
    });

    // 2️⃣ Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    const pdfPath = path.join(UPLOAD_DIR, filename);

    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
    await browser.close();

    const pdfUrl = `http://localhost:${process.env.PORT || 4000}/uploads/documents/${filename}`;

    // 3️⃣ Store metadata in DB
    const document = await prisma.document.create({
        data: {
            title,
            templateData,
            html,
            pdfUrl,
        },
    });

    if (templateData.emailTo) {
        await sendDocumentEmail({
            to: templateData.emailTo,
            subject: `Document ready: ${title}`,
            htmlBody: `<p>Hello, your document "<b>${title}</b>" is ready.<br/>
               You can download it here: <a href="${pdfUrl}">${pdfUrl}</a></p>`,
            attachPdf: true,          // set to false to send only link
            pdfPath: pdfPath,         // local path
            pdfUrl: pdfUrl,
        });
    }

    return document;
}
