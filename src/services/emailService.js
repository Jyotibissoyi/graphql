import nodemailer from "nodemailer";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const __dirname = process.cwd();

/**
 * createTransporter()
 * Creates a Nodemailer transporter using either Ethereal or real SMTP credentials.
 */
async function createTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    console.log("🧪 Using Ethereal test account:", testAccount.user);
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  
}

/**
 * sendDocumentEmail()
 * Sends an email with the PDF attached or link only.
 * @param {Object} options - { to, subject, htmlBody, attachPdf, pdfPath, pdfUrl }
 */
export async function sendDocumentEmail({
  to,
  subject = "Your document is ready",
  htmlBody,
  attachPdf = false,
  pdfPath = null,
  pdfUrl = null,
}) {
  const transporter = await createTransporter();
  const from = process.env.FROM_EMAIL || "no-reply@example.com";

  const mailOptions = {
    from,
    to,
    subject,
    html: htmlBody || `<p>Your document is ready. Download it here: <a href="${pdfUrl}">${pdfUrl}</a></p>`,
    attachments: [],
  };

  if (attachPdf && pdfPath && (await fs.pathExists(pdfPath))) {
    mailOptions.attachments.push({
      filename: path.basename(pdfPath),
      path: pdfPath,
      contentType: "application/pdf",
    });
  }

  const info = await transporter.sendMail(mailOptions);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log("📧 Preview email at:", previewUrl);

  return { success: true, previewUrl };
}
