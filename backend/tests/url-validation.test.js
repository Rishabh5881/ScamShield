import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("URL analysis validation", () => {
  it("rejects an empty URL for an authenticated user", async () => {
    const email = `module13-url-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 URL User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    const response = await request(app)
      .post("/api/analysis")
      .set("Authorization", `Bearer ${signup.body.token}`)
      .send({
        inputType: "url",
        originalInput: "   ",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("URL is required.");
  });
});
