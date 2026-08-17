const SIGNALS = [
  {
    key: "ipAddressHost",
    weight: 25,
    detect: ({ hostname }) =>
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname),
  },

  {
    key: "suspiciousTld",
    weight: 15,
    detect: ({ hostname }) =>
      /\.(xyz|top|click|tk|ml|ga|cf|gq|work|zip|mov)$/i.test(hostname),
  },

  {
    key: "excessiveSubdomains",
    weight: 15,
    detect: ({ hostname }) => {
      const isIpAddress =
        /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

      if (isIpAddress) {
        return false;
      }

      return hostname.split(".").length >= 4;
    },
  },

  {
    key: "urlShortener",
    weight: 20,
    detect: ({ hostname }) =>
      /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|ow\.ly|cutt\.ly)$/i.test(
        hostname
      ),
  },

  {
    key: "punycodeDomain",
    weight: 20,
    detect: ({ hostname }) =>
      hostname.includes("xn--"),
  },

  {
    key: "suspiciousPath",
    weight: 15,
    detect: ({ pathname }) =>
      /\/(verify|secure|account|update|confirm|unlock|login|signin|wallet|kyc)/i.test(
        pathname
      ),
  },

  {
    key: "credentialKeywords",
    weight: 20,
    detect: ({ pathname, search }) =>
      /(password|passwd|otp|pin|cvv|credential|card)/i.test(
        `${pathname}${search}`
      ),
  },

  {
    key: "paymentKeywords",
    weight: 15,
    detect: ({ pathname, search }) =>
      /(payment|pay|upi|transfer|refund|bank|wallet)/i.test(
        `${pathname}${search}`
      ),
  },

  {
    key: "suspiciousQuery",
    weight: 10,
    detect: ({ search }) =>
      /(redirect|return|url|next|continue|token|session)=/i.test(search),
  },

  {
    key: "httpWithoutTls",
    weight: 10,
    detect: ({ protocol }) =>
      protocol === "http",
  },

  {
    key: "longUrl",
    weight: 10,
    detect: ({ href }) =>
      href.length > 150,
  },
];

export function calculateUrlRisk(normalizedUrl) {
  if (!normalizedUrl) {
    return {
      riskScore: 0,
      severity: "LOW",
      detectedSignals: [],
    };
  }

  let riskScore = 0;
  const detectedSignals = [];

  for (const signal of SIGNALS) {
    if (signal.detect(normalizedUrl)) {
      riskScore += signal.weight;
      detectedSignals.push(signal.key);
    }
  }

  riskScore = Math.min(100, riskScore);

  return {
    riskScore,
    severity: getUrlSeverity(riskScore),
    detectedSignals,
  };
}

function getUrlSeverity(riskScore) {
  if (riskScore >= 81) return "CRITICAL";
  if (riskScore >= 61) return "HIGH";
  if (riskScore >= 31) return "SUSPICIOUS";
  return "LOW";
}