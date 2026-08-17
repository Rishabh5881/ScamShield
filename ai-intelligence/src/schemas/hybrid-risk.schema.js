import { z } from "zod";

export const hybridRiskSchema = z.object({
  riskScore: z.number().min(0).max(100),

  severity: z.enum([
    "LOW",
    "SUSPICIOUS",
    "HIGH",
    "CRITICAL",
  ]),

  components: z.object({
    messageRisk: z.number().min(0).max(100),
    urlRisk: z.number().min(0).max(100).nullable(),
  }),
});

export function validateHybridRisk(data) {
  return hybridRiskSchema.safeParse(data);
}
