import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Screenshot analysis integration", () => {
  it("analyzes a valid PNG screenshot and persists the result", async () => {
    const email = `module13-screenshot-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Screenshot Analysis User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    const pngBuffer = Buffer.from(
      "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000000020001e221bc330000000049454e44ae426082",
      "hex"
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            classification: "SCAM",
            riskScore: 91,
            confidence: 0.97,
            scamType: "Phishing",
            severity: "CRITICAL",
            explanation: "Screenshot contains suspicious verification content.",
            redFlags: ["Urgency", "Credential request"],
            attackPattern: ["Credential theft"],
            recommendedActions: ["Do not enter credentials."],
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
      .field("inputType", "screenshot")
      .attach("file", pngBuffer, {
        filename: "scam.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.inputType).toBe("screenshot");
    expect(response.body.data.result.classification).toBe("SCAM");
    expect(response.body.data.result.riskScore).toBe(91);
    expect(response.body.data.result.severity).toBe("CRITICAL");
  });
});
