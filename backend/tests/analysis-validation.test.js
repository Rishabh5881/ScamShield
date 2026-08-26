import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Analysis authorization", () => {
  it(
    "allows guest analysis requests without authentication",
    async () => {
      const response = await request(app)
        .post("/api/analysis")
        .send({
          inputType: "message",
          originalInput:
            "Hello, this is a test message",
        });

      console.log("STATUS:", response.status);
      console.log("BODY:", response.body);

      expect(response.status).not.toBe(401);
      expect(response.body.success).toBeDefined();
    },
    15000
  );
});