
import { z } from "zod";

const classificationSchema = z.enum([
  "SCAM",
  "SUSPICIOUS",
  "SAFE",
]);

const severitySchema = z.enum([
  "LOW",
  "SUSPICIOUS",
  "HIGH",
  "CRITICAL",
]);

const scamTypeSchema = z.enum([
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
]);

const screenshotAnalysisSchema = z.object({
  classification: classificationSchema,

  severity: severitySchema,

  riskScore: z
    .number()
    .int()
    .min(0)
    .max(100),

  confidence: z
    .number()
    .min(0)
    .max(1),

  scamType: scamTypeSchema,

  redFlags: z
    .array(z.string().min(1))
    .max(20),

  attackPattern: z
    .array(z.string().min(1))
    .max(20),

  explanation: z
    .string()
    .min(1)
    .max(3000),

  recommendedActions: z
    .array(z.string().min(1))
    .max(20),
});

export function validateScreenshotAnalysis(data) {
  return screenshotAnalysisSchema.safeParse(data);
}

export { screenshotAnalysisSchema };

