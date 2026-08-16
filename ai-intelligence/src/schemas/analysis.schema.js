import { z } from "zod";

export const analysisSchema = z.object({
  classification: z.enum(["SAFE", "SUSPICIOUS", "SCAM"]),

  confidence: z
    .number()
    .min(0)
    .max(1),

  scamType: z.enum([
    "Phishing",
    "Banking Scam",
    "UPI/Payment Scam",
    "Job Scam",
    "Investment Scam",
    "Lottery/Prize Scam",
    "Fake Customer Support",
    "Delivery Scam",
    "Account Takeover",
    "Credential Theft",
    "Social Engineering",
    "Other/Suspicious",
  ]),

  redFlags: z
    .array(z.string())
    .max(10),

  attackPattern: z
    .array(z.string())
    .max(10),

  explanation: z
    .string()
    .min(1)
    .max(2000),

  recommendedActions: z
    .array(z.string())
    .max(10),
});

export function validateAnalysisOutput(data) {
  return analysisSchema.safeParse(data);
}