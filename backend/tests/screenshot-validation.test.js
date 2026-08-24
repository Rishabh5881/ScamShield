import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Screenshot validation", () => {
  it("rejects an unsupported screenshot file type", async () => {
    const email = `module13-shot-${Date.now()}@example.com`;
    const password = "StrongPassword123!";

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Module 13 Screenshot User",
        email,
        password,
      });

    expect(signup.status).toBe(201);

    const response = await request(app)
      .post("/api/analysis")
      .set("Authorization", `Bearer ${signup.body.token}`)
      .field("inputType", "screenshot")
      .attach(
        "file",
        Buffer.from("not an image"),
        {
          filename: "malicious.txt",
          contentType: "text/plain",
        }
      );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
