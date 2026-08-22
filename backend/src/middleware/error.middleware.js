export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Screenshot is too large. Maximum size is 10MB.",
      code: "FILE_TOO_LARGE",
    });
  }

  if (error?.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Unsupported screenshot format. Use PNG, JPEG, or WEBP.",
      code: "UNSUPPORTED_FILE_TYPE",
    });
  }

  if (error.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
}
