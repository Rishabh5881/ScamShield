import {
  messageSystemPrompt,
  buildMessageUserPrompt,
} from "../prompts/message.prompt.js";

import { generateAIResponse } from "../providers/gemini.provider.js";

import {
  validateAnalysisOutput,
} from "../schemas/analysis.schema.js";

import {
  calculateRiskScore,
} from "../risk/risk.engine.js";

import {
  analyzeUrls,
} from "../intelligence/url/url-intelligence.service.js";

import {
  calculateHybridRisk,
} from "../risk/hybrid-risk.engine.js";

import {
  validateHybridRisk,
} from "../schemas/hybrid-risk.schema.js";

import {
  buildRiskEvidence,
} from "../risk/risk-evidence.service.js";

import {
  buildRiskDecision,
} from "../risk/risk-decision.service.js";

import {
  applyRiskDecisionGuard,
} from "../risk/risk-decision.guard.js";

import {
  validateRiskDecision,
} from "../schemas/risk-decision.schema.js";

export async function analyzeMessage(text) {
  // 1. Input validation
  if (!text || typeof text !== "string") {
    throw new Error("Message text is required");
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("Message cannot be empty");
  }

  if (trimmedText.length > 10000) {
    throw new Error("Message is too long");
  }

  // 2. AI analysis
  const rawResponse = await generateAIResponse({
    systemPrompt: messageSystemPrompt,
    userPrompt: buildMessageUserPrompt(trimmedText),
  });

  // 3. Parse AI JSON
  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch (error) {
    console.error("AI JSON PARSE ERROR");

    throw new Error("AI returned invalid JSON");
  }

  // 4. Validate AI response
  const validation =
    validateAnalysisOutput(parsedResponse);

  if (!validation.success) {
    console.error("AI SCHEMA VALIDATION ERROR");

    throw new Error(
      "AI response failed schema validation"
    );
  }

  const aiResult =
    validation.data;

  // 5. Deterministic message risk
  const messageRisk =
    calculateRiskScore(
      trimmedText,
      aiResult
    );

  // 6. URL intelligence
  const urlIntelligence =
    analyzeUrls(trimmedText);

  // 7. Hybrid risk aggregation
  const hybridRisk =
    calculateHybridRisk({
      messageRiskScore:
        messageRisk.riskScore,

      urlRiskScore:
        urlIntelligence.detected
          ? urlIntelligence.overallRiskScore
          : null,
    });

  // 8. Validate hybrid risk
  const hybridValidation =
    validateHybridRisk(
      hybridRisk
    );

  if (!hybridValidation.success) {
    console.error("HYBRID RISK VALIDATION ERROR");

    throw new Error(
      "Hybrid risk validation failed"
    );
  }

  const validatedHybridRisk =
    hybridValidation.data;

  // 9. Risk evidence / explainability
  const riskEvidence =
    buildRiskEvidence({
      messageRisk,
      urlIntelligence,
      aiResult,
    });

  // 10. Base risk decision
  const riskDecision =
    buildRiskDecision({
      classification:
        aiResult.classification,

      riskScore:
        validatedHybridRisk.riskScore,

      severity:
        validatedHybridRisk.severity,
    });

  // 11. Decision guard
  const guardedRiskDecision =
    applyRiskDecisionGuard({
      classification:
        aiResult.classification,

      riskScore:
        validatedHybridRisk.riskScore,

      severity:
        validatedHybridRisk.severity,

      urlIntelligence,

      hybridRisk:
        validatedHybridRisk,

      riskEvidence,

      riskDecision,
    });

  // 12. Validate final risk decision
  const riskDecisionValidation =
    validateRiskDecision(
      guardedRiskDecision
    );

  if (!riskDecisionValidation.success) {
    console.error("RISK DECISION VALIDATION ERROR");

    throw new Error(
      "Risk decision validation failed"
    );
  }

  const validatedRiskDecision =
    riskDecisionValidation.data;

  // 13. Final structured response
  return {
    classification:
      aiResult.classification,

    riskScore:
      validatedHybridRisk.riskScore,

    confidence:
      aiResult.confidence,

    scamType:
      aiResult.scamType,

    severity:
      validatedHybridRisk.severity,

    redFlags:
      aiResult.redFlags,

    attackPattern:
      aiResult.attackPattern,

    explanation:
      aiResult.explanation,

    recommendedActions:
      aiResult.recommendedActions,

    detectedSignals:
      messageRisk.detectedSignals,

    urlIntelligence,

    hybridRisk: {
      messageRisk:
        validatedHybridRisk
          .components
          .messageRisk,

      urlRisk:
        validatedHybridRisk
          .components
          .urlRisk,
    },

    riskEvidence,

    riskDecision:
      validatedRiskDecision,
  };
}


