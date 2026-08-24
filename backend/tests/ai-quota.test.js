import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AI quota handling", () => {
  it("returns 429 when the AI provider quota is exceeded", async () => {
    const email = `module13-quota-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Quota User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "AI_QUOTA_EXCEEDED",
            message: "AI provider quota exceeded",
          },
        }),
        {
          status: 429,
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
        originalInput: "Your account requires urgent verification.",
      });

    expect(response.status).toBe(429);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe(
      "AI_QUOTA_EXCEEDED"
    );
    expect(response.body.error.retryable).toBe(true);
  });
});
