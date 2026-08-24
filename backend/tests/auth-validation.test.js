import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Signup validation", () => {
  it("rejects signup with an invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "not-an-email",
        password: "StrongPassword123",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
