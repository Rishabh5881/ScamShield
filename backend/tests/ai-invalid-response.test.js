import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AI invalid response handling", () => {
  it("returns 502 when the AI service returns an invalid analysis result", async () => {
    const email = `module13-ai-invalid-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 AI Invalid User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: null,
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
        originalInput: "Verify your account immediately.",
      });

    expect(response.status).toBe(502);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe(
      "AI_INVALID_RESPONSE"
    );
    expect(response.body.error.retryable).toBe(true);
  });
});
