import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion ?? 0,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
}
