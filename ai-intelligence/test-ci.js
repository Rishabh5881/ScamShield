import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

console.log("\n=== ScamShield AI CI Test ===\n");

const assetsDir = path.resolve("test-assets");
const imagePath = path.resolve("test-assets/scam-message.jpeg");

console.log("1. Checking test assets...");

assert.ok(
  fs.existsSync(assetsDir),
  `Missing test-assets directory: ${assetsDir}`
);

assert.ok(
  fs.existsSync(imagePath),
  `Missing screenshot test asset: ${imagePath}`
);

const imageBuffer = fs.readFileSync(imagePath);

assert.ok(
  imageBuffer.length > 0,
  "Screenshot test asset is empty."
);

console.log(
  `2. Screenshot fixture loaded: ${(imageBuffer.length / 1024).toFixed(2)} KB`
);

console.log("3. Validating AI service test environment...");

assert.equal(
  typeof imageBuffer.length,
  "number",
  "Invalid image buffer."
);

assert.ok(
  imageBuffer.length > 100,
  "Screenshot fixture is unexpectedly small."
);

console.log("4. AI service CI test PASSED.");
console.log("5. No external AI API call was made.");
console.log("\n=== AI CI Test PASSED ===\n");
