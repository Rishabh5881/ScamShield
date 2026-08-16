import { getAnalysisHistory } from "../services/history.service.js";

export async function getHistoryController(req, res, next) {
  try {
    const history = await getAnalysisHistory(req.user.id);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}