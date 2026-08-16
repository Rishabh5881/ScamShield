import "dotenv/config";

import { analyzeMessage } from "./services/message-analysis.service.js";

const testMessage =
  "URGENT! Your bank account will be blocked. Click this link immediately to verify your account.";

try {
  const result = await analyzeMessage(testMessage);

  console.log("\n=== ScamShield AI Result ===\n");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("\n=== ScamShield AI Error ===\n");
  console.error(error.message);
  process.exitCode = 1;
}