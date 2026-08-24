import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Authenticated user API", () => {
  it("returns the authenticated user from a valid token", async () => {
    const email = `module13-me-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Me User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    const token = signup.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.name).toBe("Module 13 Me User");
    expect(response.body.user.id).toBeTruthy();
  });
});
