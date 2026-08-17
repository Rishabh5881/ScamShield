const ACTION_PRIORITY = {
  ALLOW: 0,
  WARN: 1,
  BLOCK: 2,
};

const SEVERITY_PRIORITY = {
  LOW: 0,
  SUSPICIOUS: 1,
  HIGH: 2,
  CRITICAL: 3,
};

function normalizeSeverity(severity) {
  return String(severity || "").toUpperCase();
}

function normalizeClassification(classification) {
  return String(classification || "").toUpperCase();
}

export function applyRiskDecisionGuard({
  classification,
  riskScore,
  severity,
  urlIntelligence,
  hybridRisk,
  riskEvidence,
  riskDecision,
}) {
  const normalizedClassification =
    normalizeClassification(classification);

  const normalizedSeverity =
    normalizeSeverity(severity);

  let action = riskDecision?.action || "ALLOW";

  const urlSeverity = normalizeSeverity(
    urlIntelligence?.overallSeverity
  );

  const urlRiskScore =
    Number(urlIntelligence?.overallRiskScore) || 0;

  const finalRiskScore =
    Number(riskScore) || 0;

  /*
   * Rule 1:
   * Critical URL intelligence must never be ignored.
   */
  if (
    urlSeverity === "CRITICAL" ||
    urlRiskScore >= 80
  ) {
    action = "BLOCK";
  }

  /*
   * Rule 2:
   * Critical final severity always blocks.
   */
  if (normalizedSeverity === "CRITICAL") {
    action = "BLOCK";
  }

  /*
   * Rule 3:
   * Confirmed SCAM with meaningful risk blocks.
   */
  if (
    normalizedClassification === "SCAM" &&
    finalRiskScore >= 70
  ) {
    action = "BLOCK";
  }

  /*
   * Rule 4:
   * HIGH risk cannot be silently allowed.
   */
  if (
    normalizedSeverity === "HIGH" &&
    action === "ALLOW"
  ) {
    action = "WARN";
  }

  /*
   * Rule 5:
   * SUSPICIOUS risk cannot be silently allowed.
   */
  if (
    normalizedSeverity === "SUSPICIOUS" &&
    action === "ALLOW"
  ) {
    action = "WARN";
  }

  /*
   * Safety invariant:
   * Guard must never downgrade a stronger
   * action produced by the risk engine.
   */
  const originalPriority =
    ACTION_PRIORITY[riskDecision?.action] ?? 0;

  const guardedPriority =
    ACTION_PRIORITY[action] ?? 0;

  if (originalPriority > guardedPriority) {
    action = riskDecision.action;
  }

  return {
    verdict: normalizedClassification,
    riskScore: finalRiskScore,
    severity: normalizedSeverity,
    action,

    guard: {
      applied: action !== riskDecision?.action,
      reason:
        action === "BLOCK"
          ? "High-confidence or critical risk requires blocking"
          : action === "WARN"
            ? "Elevated risk requires user warning"
            : "No blocking or warning condition detected",
    },

    evidenceCount:
      riskEvidence?.totalEvidence || 0,

    urlRisk:
      urlIntelligence?.detected
        ? urlRiskScore
        : null,

    hybridRisk:
      hybridRisk?.riskScore ?? finalRiskScore,
  };
}