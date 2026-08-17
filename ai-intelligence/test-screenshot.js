
import "dotenv/config";
import fs from "fs";
import path from "path";

import {
  analyzeScreenshot,
} from "./src/screenshot/services/screenshot-analysis.service.js";

const imagePath = path.resolve(
  "test-assets/scam-message.jpeg"
);

if (!fs.existsSync(imagePath)) {
  console.error("\n=== Screenshot Test Error ===\n");
  console.error(`Screenshot not found: ${imagePath}`);
  console.error(
    "Add a PNG/JPEG/WEBP screenshot inside test-assets first."
  );
  process.exitCode = 1;
} else {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const result = await analyzeScreenshot({
      mimeType: "image/jpeg",
      data: imageBuffer,
    });

    console.log(
      "\n=== ScamShield Screenshot AI Result ===\n"
    );

    console.log(
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error(
      "\n=== Screenshot AI Error ===\n"
    );

    console.error(error.message);
    process.exitCode = 1;
  }
}

