import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AI failure handling", () => {
  it("returns 503 when the AI service is unavailable", async () => {
    const email = `module13-ai-fail-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 AI Failure User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("AI service connection failed")
    );

    const response = await request(app)
      .post("/api/analysis")
      .set("Authorization", `Bearer ${signup.body.token}`)
      .send({
        inputType: "message",
        originalInput: "Please verify your account immediately.",
      });

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe(
      "AI_SERVICE_UNAVAILABLE"
    );
    expect(response.body.error.retryable).toBe(true);
  });
});
