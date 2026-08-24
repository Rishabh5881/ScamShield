import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("URL analysis integration", () => {
  it("converts URL intelligence into the persisted analysis result", async () => {
    const email = `module13-url-analysis-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 URL Analysis User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            overallRiskScore: 85,
            overallSeverity: "CRITICAL",
            detectedSignals: [
              "IP address host",
              "Suspicious verification path",
            ],
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
        inputType: "url",
        originalInput: "http://192.168.1.10/verify/otp",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result.classification).toBe("SCAM");
    expect(response.body.data.result.riskScore).toBe(85);
    expect(response.body.data.result.severity).toBe("CRITICAL");
    expect(response.body.data.result.scamType).toBe("Suspicious URL");
    expect(response.body.data.result.redFlags).toContain(
      "IP address host"
    );
  });
});
