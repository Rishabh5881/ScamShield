import { getDashboardAnalytics } from "../services/analytics.service.js";

export async function getDashboardAnalyticsController(req, res, next) {
  try {
    const analytics = await getDashboardAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}