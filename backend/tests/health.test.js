import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Health API", () => {
  it("returns backend health successfully", async () => {
    const response = await request(app)
      .get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "ScamShield backend is running"
    );
  });
});
