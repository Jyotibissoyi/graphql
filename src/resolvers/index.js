import { registerUser, loginUser } from "../services/authServices.js";
import { createDocument } from "../services/documentService.js";
import { sendDocumentEmail } from "../services/emailService.js";
import { handleFileUpload } from "../services/fileService.js";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient();

export const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error("Unauthorized");
            return prisma.user.findUnique({ where: { id: user.userId } });
        },
        files: async () => prisma.fileMeta.findMany(),
        documents: async () => prisma.document.findMany({ orderBy: { createdAt: "desc" } }),
    },

    Mutation: {
        register: async (_, args) => registerUser(args.name, args.email, args.password),
        login: async (_, args) => loginUser(args.email, args.password),
        uploadFile: async (_, { file }) => handleFileUpload(file),
        createDocument: async (_, { title, templateData, sendEmailTo }) => {
            const doc = await createDocument({ title, templateData });
            if (sendEmailTo) {
                await sendDocumentEmail({
                    to: sendEmailTo,
                    subject: `Document ready: ${title}`,
                    attachPdf: true,
                    pdfPath: `src/uploads/documents/${title.replace(/\s+/g, "_")}.pdf`,
                    pdfUrl: doc.pdfUrl,
                });
            }
            return doc;
        },
    },
};
