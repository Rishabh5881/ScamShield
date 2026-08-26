import OpenAI from "openai";
import { aiConfig } from "../config/ai.config.js";

const client = new OpenAI({
  apiKey: aiConfig.apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  timeout: aiConfig.timeout,
});

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  const status =
    error?.status ||
    error?.response?.status;

  const code = error?.code;

  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_HEADERS_TIMEOUT"
  );
}

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const startedAt = Date.now();

    try {
      console.log(
        "AI PROVIDER → OPENROUTER REQUEST START",
        {
          attempt,
          maxAttempts: MAX_RETRIES,
          model: aiConfig.model,
        }
      );

      const response =
        await client.chat.completions.create({
          model: aiConfig.model,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        });

      const durationMs =
        Date.now() - startedAt;

      const content =
        response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(
          "AI provider returned an empty response"
        );
      }

      console.log(
        "AI PROVIDER → OPENROUTER SUCCESS",
        {
          attempt,
          durationMs,
        }
      );

      return content;
    } catch (error) {
      lastError = error;

      const status =
        error?.status ||
        error?.response?.status;

      const retryable =
        isRetryableError(error);

      console.error(
        "AI PROVIDER → OPENROUTER ERROR",
        {
          attempt,
          status,
          code: error?.code,
          type: error?.type,
          message: error?.message,
          retryable,
          durationMs:
            Date.now() - startedAt,
        }
      );

      if (
        !retryable ||
        attempt >= MAX_RETRIES
      ) {
        break;
      }

      const delay =
        RETRY_DELAYS[attempt - 1] || 4000;

      console.warn(
        "AI PROVIDER → OPENROUTER RETRY",
        {
          attempt,
          nextAttempt: attempt + 1,
          delayMs: delay,
          status,
        }
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
