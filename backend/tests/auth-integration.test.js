import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Auth integration", () => {
  it("creates a user and then logs in with the created credentials", async () => {
    const email = `module13-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Test User",
        email,
        password,
      });

    expect(signup.status).toBe(201);
    expect(signup.body.success).toBe(true);
    expect(signup.body.user.email).toBe(email);
    expect(signup.body.token).toEqual(expect.any(String));

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(login.status).toBe(200);
    expect(login.body.success).toBe(true);
    expect(login.body.user.email).toBe(email);
    expect(login.body.token).toEqual(expect.any(String));
  });
});
