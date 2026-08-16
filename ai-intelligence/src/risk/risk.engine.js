const SIGNALS = [
  {
    key: "urgency",
    weight: 15,
    patterns: [
      /\burgent\b/i,
      /\bimmediately\b/i,
      /\bact now\b/i,
      /\blast chance\b/i,
      /\bwithin\s+\d+\s+(minutes?|hours?)\b/i,
    ],
  },
  {
    key: "threat",
    weight: 15,
    patterns: [
      /\bblocked\b/i,
      /\bsuspended\b/i,
      /\bclosed\b/i,
      /\blegal action\b/i,
      /\bpolice\b/i,
      /\barrest\b/i,
    ],
  },
  {
    key: "sensitiveData",
    weight: 20,
    patterns: [
      /\bpassword\b/i,
      /\bpin\b/i,
      /\botp\b/i,
      /\bcvv\b/i,
      /\bcard number\b/i,
      /\baccount number\b/i,
    ],
  },
  {
    key: "paymentRequest",
    weight: 15,
    patterns: [
      /\bsend money\b/i,
      /\bpay now\b/i,
      /\bpayment\b/i,
      /\btransfer\b/i,
      /\bupi\b/i,
    ],
  },
  {
    key: "reward",
    weight: 10,
    patterns: [
      /\bwon\b/i,
      /\bprize\b/i,
      /\breward\b/i,
      /\blottery\b/i,
      /\bcashback\b/i,
    ],
  },
  {
    key: "suspiciousLink",
    weight: 15,
    patterns: [
      /https?:\/\/\S+/i,
      /\bclick\s+(here|this|the link)\b/i,
      /\bverify\s+(your\s+)?account\b/i,
    ],
  },
  {
    key: "impersonation",
    weight: 10,
    patterns: [
      /\bbank\b/i,
      /\bcustomer\s+support\b/i,
      /\bpolice\b/i,
      /\bgovernment\b/i,
      /\bofficial\b/i,
    ],
  },
];

export function calculateRiskScore(text, aiResult = {}) {
  const input = String(text || "");

  let deterministicScore = 0;
  const detectedSignals = [];

  for (const signal of SIGNALS) {
    const detected = signal.patterns.some((pattern) =>
      pattern.test(input)
    );

    if (detected) {
      deterministicScore += signal.weight;
      detectedSignals.push(signal.key);
    }
  }

  deterministicScore = Math.min(100, deterministicScore);

  const aiConfidence = Math.max(
    0,
    Math.min(1, Number(aiResult.confidence) || 0)
  );

  const aiRisk =
    aiResult.classification === "SCAM"
      ? 80 + aiConfidence * 20
      : aiResult.classification === "SUSPICIOUS"
        ? 45 + aiConfidence * 20
        : aiResult.classification === "SAFE"
          ? 10
          : 0;

  const riskScore = Math.round(
    deterministicScore * 0.6 + aiRisk * 0.4
  );

  return {
    riskScore: Math.min(100, Math.max(0, riskScore)),
    detectedSignals,
  };
}

export function getSeverity(riskScore) {
  if (riskScore >= 81) return "CRITICAL";
  if (riskScore >= 61) return "HIGH";
  if (riskScore >= 31) return "SUSPICIOUS";
  return "LOW";
}