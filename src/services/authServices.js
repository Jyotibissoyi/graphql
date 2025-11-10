import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashed },
  });
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, user };
};
