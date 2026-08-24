import prisma from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER DEBUG:", JSON.stringify(authHeader));

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.substring(7);

    console.log("TOKEN DEBUG:", {
      length: token.length,
      parts: token.split(".").length,
      start: token.substring(0, 10),
      end: token.substring(token.length - 10),
    });

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked",
      });
    }

    const { tokenVersion, ...safeUser } = user;

    req.user = safeUser;

    next();
  } catch (error) {
    console.error("AUTH DEBUG:", error.name, error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
