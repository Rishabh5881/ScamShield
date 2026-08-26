import crypto from "crypto";
import prisma from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";

const GUEST_COOKIE_NAME = "scamshield_guest_id";

function parseCookies(cookieHeader = "") {
  const cookies = {};

  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");

    if (index === -1) continue;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    if (key) {
      cookies[key] = decodeURIComponent(value);
    }
  }

  return cookies;
}

function setGuestCookie(res, guestId) {
  const isProduction =
    process.env.NODE_ENV === "production";

  const cookie = [
    `${GUEST_COOKIE_NAME}=${encodeURIComponent(guestId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=None",
    ...(isProduction ? ["Secure"] : []),
    "Max-Age=31536000",
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
}

export async function allowAuthenticatedOrGuest(
  req,
  res,
  next
) {
  try {
    /*
     * --------------------------------------
     * AUTHENTICATED USER
     * --------------------------------------
     */

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      const token =
        authHeader.substring(7);

      const decoded =
        verifyToken(token);

      const user =
        await prisma.user.findUnique({
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

      if (
        decoded.tokenVersion !==
        user.tokenVersion
      ) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked",
        });
      }

      const {
        tokenVersion,
        ...safeUser
      } = user;

      req.user = safeUser;
      req.isGuest = false;

      return next();
    }

    /*
     * --------------------------------------
     * GUEST USER
     * --------------------------------------
     */

    const cookies =
      parseCookies(
        req.headers.cookie || ""
      );

    let guestId =
      cookies[GUEST_COOKIE_NAME];

    if (!guestId) {
      guestId =
        crypto.randomUUID();

      setGuestCookie(
        res,
        guestId
      );
    }

    const guestUsage =
      await prisma.guestUsage.findUnique({
        where: {
          guestId,
        },
        select: {
          analysisCount: true,
        },
      });

    if (
      guestUsage &&
      guestUsage.analysisCount >= 1
    ) {
      return res.status(401).json({
        success: false,
        error: {
          code: "LOGIN_REQUIRED",
          message:
            "Your free analysis has been used. Please login or signup to continue.",
          retryable: false,
        },
      });
    }

    req.isGuest = true;
    req.guestId = guestId;

    next();
  } catch (error) {
    console.error(
      "Guest/Auth middleware error:",
      error
    );

    return res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_FAILED",
        message:
          "Authentication could not be verified.",
        retryable: false,
      },
    });
  }
}