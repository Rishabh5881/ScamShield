import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("History authorization", () => {
  it("rejects history requests without authentication", async () => {
    const response = await request(app)
      .get("/api/analysis/history");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Authentication required"
    );
  });
});
