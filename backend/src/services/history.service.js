import prisma from "../config/prisma.js";

export async function getAnalysisHistory(userId) {
  return prisma.analysis.findMany({
    where: {
      userId,
    },
    include: {
      result: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAnalysisDetails(userId, analysisId) {
  return prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId,
    },
    include: {
      result: true,
    },
  });
}
