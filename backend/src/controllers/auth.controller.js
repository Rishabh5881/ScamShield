import { signup, login } from "../services/auth.service.js";
import {
  signupSchema,
  loginSchema,
} from "../validators/auth.validator.js";

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
export async function logoutController(req, res) {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}