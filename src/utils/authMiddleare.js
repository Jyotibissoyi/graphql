import { verifyToken } from "./jwt.js";

export const authMiddleware = async ({ req }) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return { user: null };

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  return { user: decoded || null };
};
