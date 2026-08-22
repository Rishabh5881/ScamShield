import prisma from "../config/prisma.js";

export async function getDashboardAnalytics(userId) {
  const [
    totalAnalyses,
    totalScams,
    highRisk,
    suspicious,
    safe,
    scamCategories,
    riskDistribution,
    recentActivity,
    detectionRecords,
  ] = await Promise.all([
    prisma.analysis.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
        classification: "SCAM",
      },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
        riskScore: {
          gte: 61,
        },
      },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
        riskScore: {
          gte: 31,
          lte: 60,
        },
      },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
        riskScore: {
          lte: 30,
        },
      },
    }),

    prisma.analysisResult.groupBy({
      by: ["scamType"],
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
      },
      _count: {
        scamType: true,
      },
      orderBy: {
        _count: {
          scamType: "desc",
        },
      },
    }),

    prisma.analysisResult.groupBy({
      by: ["severity"],
      where: {
        analysis: {
          userId,
          status: "COMPLETED",
        },
      },
      _count: {
        severity: true,
      },
    }),

    prisma.analysis.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        result: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    prisma.analysis.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        createdAt: true,
        result: {
          select: {
            classification: true,
            riskScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const trends = {};

  for (const analysis of detectionRecords) {
    const date = analysis.createdAt
      .toISOString()
      .slice(0, 10);

    if (!trends[date]) {
      trends[date] = {
        date,
        total: 0,
        scams: 0,
      };
    }

    trends[date].total += 1;

    if (
      analysis.result?.classification === "SCAM"
    ) {
      trends[date].scams += 1;
    }
  }

  return {
    summary: {
      totalAnalyses,
      totalScams,
      highRisk,
      suspicious,
      safe,
    },

    scamCategories: scamCategories.map((item) => ({
      scamType: item.scamType,
      count: item._count.scamType,
    })),

    riskDistribution: riskDistribution.map((item) => ({
      severity: item.severity,
      count: item._count.severity,
    })),

    detectionTrends: Object.values(trends),

    recentActivity,
  };
}
