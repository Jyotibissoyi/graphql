import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { GraphQLUpload } from  "graphql-upload-ts";

const prisma = new PrismaClient();
const __dirname = path.resolve();

export const handleFileUpload = async (file) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  const uploadDir = path.join(__dirname, "src/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const filePath = path.join(uploadDir, filename);
  const stream = createReadStream();
  const out = fs.createWriteStream(filePath);
  stream.pipe(out);
  await new Promise((res, rej) => {
    out.on("finish", res);
    out.on("error", rej);
  });

  const stats = fs.statSync(filePath);
  const url = `http://localhost:${process.env.PORT}/uploads/${filename}`;

  const meta = await prisma.fileMeta.create({
    data: { filename, mimetype, encoding, size: stats.size, url },
  });

  return meta;
};
