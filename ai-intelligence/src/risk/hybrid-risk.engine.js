const MESSAGE_WEIGHT = 0.7;
const URL_WEIGHT = 0.3;

export function calculateHybridRisk({
  messageRiskScore = 0,
  urlRiskScore = null,
}) {
  const messageRisk = clamp(messageRiskScore);

  // No URL detected:
  // message risk remains the final risk.
  if (urlRiskScore === null || urlRiskScore === undefined) {
    return {
      riskScore: messageRisk,
      severity: getSeverity(messageRisk),
      components: {
        messageRisk,
        urlRisk: null,
      },
    };
  }

  const urlRisk = clamp(urlRiskScore);

  const riskScore = Math.round(
    messageRisk * MESSAGE_WEIGHT +
      urlRisk * URL_WEIGHT
  );

  return {
    riskScore,
    severity: getSeverity(riskScore),
    components: {
      messageRisk,
      urlRisk,
    },
  };
}

function clamp(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
}

function getSeverity(score) {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "SUSPICIOUS";
  return "LOW";
}