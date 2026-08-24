import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Auth API", () => {
  it("rejects /me when an invalid JWT is provided", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid or expired token"
    );
  });
});
