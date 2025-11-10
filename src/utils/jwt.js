import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
