import { getAnalysisHistory, getAnalysisDetails } from "../services/history.service.js";

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

export async function getHistoryDetailsController(req, res, next) {
  try {
    const analysis = await getAnalysisDetails(
      req.user.id,
      req.params.id
    );

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}
