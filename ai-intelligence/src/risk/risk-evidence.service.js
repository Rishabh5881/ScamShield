export function buildRiskEvidence({
  messageRisk,
  urlIntelligence,
  aiResult,
}) {
  const messageSignals = messageRisk?.detectedSignals || [];

  const urlSignals =
    urlIntelligence?.detectedSignals || [];

  const redFlags = aiResult?.redFlags || [];

  const attackPatterns =
    aiResult?.attackPattern || [];

  return {
    messageEvidence: messageSignals.map((signal) => ({
      source: "MESSAGE",
      signal,
    })),

    urlEvidence: urlSignals.map((signal) => ({
      source: "URL",
      signal,
    })),

    aiEvidence: [
      ...redFlags.map((redFlag) => ({
        source: "AI",
        type: "RED_FLAG",
        evidence: redFlag,
      })),

      ...attackPatterns.map((pattern) => ({
        source: "AI",
        type: "ATTACK_PATTERN",
        evidence: pattern,
      })),
    ],

    totalEvidence:
      messageSignals.length +
      urlSignals.length +
      redFlags.length +
      attackPatterns.length,
  };
}