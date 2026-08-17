import { z } from "zod";

const riskGuardSchema = z.object({
  applied: z.boolean(),
  reason: z.string().min(1),
});

export const riskDecisionSchema = z.object({
  verdict: z.enum([
    "SCAM",
    "SAFE",
    "SUSPICIOUS",
  ]),

  riskScore: z
    .number()
    .min(0)
    .max(100),

  severity: z.enum([
    "LOW",
    "SUSPICIOUS",
    "HIGH",
    "CRITICAL",
  ]),

  action: z.enum([
    "ALLOW",
    "WARN",
    "BLOCK",
  ]),

  guard: riskGuardSchema,

  evidenceCount: z
    .number()
    .int()
    .min(0),

  urlRisk: z
    .number()
    .min(0)
    .max(100)
    .nullable(),

  hybridRisk: z
    .number()
    .min(0)
    .max(100),
});

export function validateRiskDecision(data) {
  return riskDecisionSchema.safeParse(data);
}