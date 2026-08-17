import { z } from "zod";

const normalizedUrlSchema = z.object({
  original: z.string(),
  href: z.string(),
  protocol: z.enum(["http", "https"]),
  hostname: z.string().min(1),
  pathname: z.string(),
  search: z.string(),
  hash: z.string(),
  port: z.string().nullable(),
  username: z.string().nullable(),
  password: z.string().nullable(),
});

const analyzedUrlSchema = z.object({
  url: z.string(),
  normalized: normalizedUrlSchema,
  riskScore: z.number().min(0).max(100),
  severity: z.enum([
    "LOW",
    "SUSPICIOUS",
    "HIGH",
    "CRITICAL",
  ]),
  detectedSignals: z.array(z.string()),
});

export const urlIntelligenceSchema = z.object({
  detected: z.boolean(),
  totalUrls: z.number().int().min(0),
  urls: z.array(analyzedUrlSchema),
  overallRiskScore: z.number().min(0).max(100),
  overallSeverity: z.enum([
    "LOW",
    "SUSPICIOUS",
    "HIGH",
    "CRITICAL",
  ]),
  detectedSignals: z.array(z.string()),
});

export function validateUrlIntelligence(data) {
  return urlIntelligenceSchema.safeParse(data);
}