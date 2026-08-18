import "dotenv/config";
import fs from "fs";
import path from "path";

import {
  analyzeScreenshot,
} from "./src/screenshot/services/screenshot-analysis.service.js";

console.log("\n=== ScamShield Screenshot Test ===\n");

const imagePath = path.resolve(
  "test-assets/scam-message.jpeg"
);

try {
  console.log("1. Checking screenshot...");

  if (!fs.existsSync(imagePath)) {
    throw new Error(
      `Screenshot not found: ${imagePath}`
    );
  }

  const imageBuffer = fs.readFileSync(imagePath);

  if (!imageBuffer || imageBuffer.length === 0) {
    throw new Error(
      "Screenshot file is empty."
    );
  }

  console.log(
    `2. Image loaded: ${(imageBuffer.length / 1024).toFixed(2)} KB`
  );

  console.log("3. Sending screenshot to AI...");

  const result = await analyzeScreenshot({
    mimeType: "image/jpeg",
    data: imageBuffer,
  });

  console.log("4. AI response received.\n");

  console.log(
    "=== Screenshot AI Result ===\n"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );

  console.log(
    "\n=== Screenshot Test PASSED ===\n"
  );
} catch (error) {
  console.error(
    "\n=== Screenshot Test FAILED ===\n"
  );

  console.error(
    error?.message || "Screenshot analysis failed."
  );

  process.exitCode = 1;
}