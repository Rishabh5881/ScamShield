import { extractUrls } from "./url.extractor.js";
import { normalizeUrl } from "./url.normalizer.js";
import { calculateUrlRisk } from "./url.risk.engine.js";

import {
  validateUrlIntelligence,
} from "../schemas/url-intelligence.schema.js";

export function analyzeUrls(text) {
  const urls = extractUrls(text);

  if (urls.length === 0) {
    const emptyResult = {
      detected: false,
      totalUrls: 0,
      urls: [],
      overallRiskScore: 0,
      overallSeverity: "LOW",
      detectedSignals: [],
    };

    const validation = validateUrlIntelligence(emptyResult);

    if (!validation.success) {
      throw new Error("URL intelligence validation failed");
    }

    return validation.data;
  }

  const analyzedUrls = urls
    .map((url) => {
      const normalizedUrl = normalizeUrl(url);

      if (!normalizedUrl) {
        return null;
      }

      const risk = calculateUrlRisk(normalizedUrl);

      return {
        url,
        normalized: normalizedUrl,
        riskScore: risk.riskScore,
        severity: risk.severity,
        detectedSignals: risk.detectedSignals,
      };
    })
    .filter(Boolean);

  const overallRiskScore =
    analyzedUrls.length > 0
      ? Math.max(
          ...analyzedUrls.map((item) => item.riskScore)
        )
      : 0;

  const detectedSignals = [
    ...new Set(
      analyzedUrls.flatMap(
        (item) => item.detectedSignals
      )
    ),
  ];

  const result = {
    detected: analyzedUrls.length > 0,
    totalUrls: analyzedUrls.length,
    urls: analyzedUrls,
    overallRiskScore,
    overallSeverity: getSeverity(overallRiskScore),
    detectedSignals,
  };

  const validation = validateUrlIntelligence(result);

  if (!validation.success) {
    throw new Error(
      "URL intelligence validation failed"
    );
  }

  return validation.data;
}

function getSeverity(score) {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "SUSPICIOUS";
  return "LOW";
}