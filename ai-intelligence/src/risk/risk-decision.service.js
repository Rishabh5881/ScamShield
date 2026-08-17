export function buildRiskDecision({
  classification,
  riskScore,
  severity,
}) {
  let action = "ALLOW";

  if (severity === "CRITICAL") {
    action = "BLOCK";
  } else if (severity === "HIGH") {
    action = "WARN";
  } else if (severity === "SUSPICIOUS") {
    action = "WARN";
  }

  if (classification === "SCAM") {
    action = severity === "LOW" ? "WARN" : "BLOCK";
  }

  return {
    verdict: classification,
    riskScore,
    severity,
    action,
  };
}
