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
  ] = await Promise.all([
    prisma.analysis.count({
      where: { userId },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
        },
        classification: "SCAM",
      },
    }),

    prisma.analysisResult.count({
      where: {
        analysis: {
          userId,
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
        },
      },
      _count: {
        severity: true,
      },
    }),

    prisma.analysis.findMany({
      where: {
        userId,
      },
      include: {
        result: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

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

    recentActivity,
  };
}