import { createAnalysis } from "../services/analysis.service.js";

export async function createAnalysisController(req, res, next) {
  try {
    const { inputType, originalInput, result } = req.body;

    const analysis = await createAnalysis({
      userId: req.user.id,
      inputType,
      originalInput,
      result,
    });

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}