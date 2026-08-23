import "dotenv/config";

import { analyzeMessage } from "./services/message-analysis.service.js";

const testMessage =
  "URGENT! Your bank account will be blocked. Click this link immediately to verify your account.";

try {
  const result = await analyzeMessage(testMessage);

  console.log("\n=== ScamShield AI Result ===\n");
  console.log("AI test completed:", { success: Boolean(result) });
} catch (error) {
  console.error("\n=== ScamShield AI Error ===\n");
  console.error("AI test error:", { name: error?.name, code: error?.code, status: error?.status });
  process.exitCode = 1;
}

