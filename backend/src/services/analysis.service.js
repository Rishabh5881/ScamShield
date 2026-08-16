import prisma from "../config/prisma.js";

export async function createAnalysis({
  userId,
  inputType,
  originalInput,
  status = "COMPLETED",
  result,
}) {
  return prisma.$transaction(async (tx) => {
    const analysis = await tx.analysis.create({
      data: {
        userId,
        inputType,
        originalInput,
        status,
      },
    });

    const analysisResult = await tx.analysisResult.create({
      data: {
        analysisId: analysis.id,
        classification: result.classification,
        riskScore: result.riskScore,
        confidence: result.confidence,
        scamType: result.scamType,
        severity: result.severity,
        explanation: result.explanation,
        redFlags: result.redFlags ?? [],
        attackPattern: result.attackPattern ?? [],
        recommendedActions: result.recommendedActions ?? [],
      },
    });

    return {
      ...analysis,
      result: analysisResult,
    };
  });
}