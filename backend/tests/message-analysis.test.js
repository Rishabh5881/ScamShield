import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Message analysis integration", () => {
  it("persists the meaningful AI analysis result", async () => {
    const email = `module13-analysis-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Analysis User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            classification: "SCAM",
            riskScore: 94,
            confidence: 0.98,
            scamType: "Phishing",
            severity: "CRITICAL",
            explanation: "Urgent credential verification request.",
            redFlags: ["Urgency", "Credential request"],
            attackPattern: ["Phishing"],
            recommendedActions: ["Do not click the link."],
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const response = await request(app)
      .post("/api/analysis")
      .set("Authorization", `Bearer ${signup.body.token}`)
      .send({
        inputType: "message",
        originalInput: "Your account will be blocked. Verify your credentials immediately.",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result.classification).toBe("SCAM");
    expect(response.body.data.result.riskScore).toBe(94);
    expect(response.body.data.result.severity).toBe("CRITICAL");
    expect(response.body.data.result.scamType).toBe("Phishing");
  });
});
