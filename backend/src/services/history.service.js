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