import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("History API", () => {
  it("returns an authenticated user's history", async () => {
    const email = `module13-history-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 History User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    const response = await request(app)
      .get("/api/analysis/history")
      .set("Authorization", `Bearer ${signup.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
