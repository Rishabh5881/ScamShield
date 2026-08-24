import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Analysis authorization", () => {
  it("rejects analysis requests without authentication", async () => {
    const response = await request(app)
      .post("/api/analysis")
      .send({
        originalInput: "Hello, this is a test message",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Authentication required"
    );
  });
});
