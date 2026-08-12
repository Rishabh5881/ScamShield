import axios from "axios";
import { mockAnalysisResults } from "../data/mockData";

const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

const URL_PATTERN = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

// Mock-only Phase 1 service.
// This deliberately does not call an AI provider or expose credentials.
export async function analyzeMessage(payload) {
  await new Promise((resolve) => setTimeout(resolve, 950));

  const type = payload?.type || "message";

  if (type === "screenshot") {
    if (!payload?.file) {
      const error = new Error("Please upload a screenshot to analyze.");
      error.code = "VALIDATION";
      throw error;
    }
  } else {
    const value = payload?.message?.trim();
    if (!value) {
      const error = new Error(
        type === "url" ? "Please paste a URL to analyze." : "Please enter something to analyze."
      );
      error.code = "VALIDATION";
      throw error;
    }
    if (type === "url" && !URL_PATTERN.test(value)) {
      const error = new Error("That doesn't look like a valid URL.");
      error.code = "VALIDATION";
      throw error;
    }
  }

  return mockAnalysisResults[type] || mockAnalysisResults.message;
}

export default api;
