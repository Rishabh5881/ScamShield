import { signup, login } from "../services/auth.service.js";
import {
  signupSchema,
  loginSchema,
} from "../validators/auth.validator.js";
import prisma from "../config/prisma.js";

export async function signupController(req, res, next) {
  try {
    const validatedData = signupSchema.parse(req.body);

    const result = await signup(validatedData);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await login(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}
