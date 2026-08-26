import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "/api",

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// ==========================================
// AUTH TOKEN INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    try {
      const raw =
        localStorage.getItem(
          "scamshield:auth"
        );

      const auth = raw
        ? JSON.parse(raw)
        : null;

      if (auth?.token) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${auth.token}`;
      }
    } catch {
      // Ignore malformed auth storage.
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

// ==========================================
// HELPERS
// ==========================================

const URL_PATTERN =
  /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

function normalizeError(error) {
  // ----------------------------------------
  // TIMEOUT
  // ----------------------------------------

  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT"
  ) {
    return "Request timed out. Please try again.";
  }

  const status =
    error?.response?.status;

  const data =
    error?.response?.data;

  // ----------------------------------------
  // 429 AI QUOTA / RATE LIMIT
  // ----------------------------------------

  if (status === 429) {
    return (
      data?.error?.message ||
      data?.message ||
      "AI analysis quota has been reached. Please try again later."
    );
  }

  // ----------------------------------------
  // 401 AUTH
  // ----------------------------------------

  if (status === 401) {
    return (
      data?.error?.message ||
      data?.message ||
      "Your session has expired. Please log in again."
    );
  }

  // ----------------------------------------
  // 503 AI SERVICE UNAVAILABLE
  // ----------------------------------------

  if (status === 503) {
    return (
      data?.error?.message ||
      data?.message ||
      "AI analysis is temporarily unavailable. Please try again later."
    );
  }

  // ----------------------------------------
  // OTHER API ERRORS
  // ----------------------------------------

  const message =
    data?.error?.message ||
    data?.message ||
    (
      typeof data?.error === "string"
        ? data.error
        : null
    ) ||
    error?.message;

  return (
    message ||
    "Unable to connect to ScamShield backend."
  );
}

// ==========================================
// ERROR OBJECT BUILDER
// ==========================================

function createApiError(error) {
  const next = new Error(
    normalizeError(error)
  );

  const status =
    error?.response?.status;

  const backendCode =
    error?.response?.data
      ?.error?.code;

  // ----------------------------------------
  // AI QUOTA EXCEEDED
  // ----------------------------------------

  if (
    status === 429 &&
    backendCode ===
      "AI_QUOTA_EXCEEDED"
  ) {
    next.code =
      "AI_QUOTA_EXCEEDED";

    next.status = 429;

    return next;
  }

  // ----------------------------------------
  // OTHER 429 RATE LIMIT
  // ----------------------------------------

  if (status === 429) {
    next.code =
      "AI_RATE_LIMITED";

    next.status = 429;

    return next;
  }

  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  if (status === 401) {
    next.code = "AUTH";
    next.status = 401;

    return next;
  }

  // ----------------------------------------
  // TIMEOUT
  // ----------------------------------------

  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT"
  ) {
    next.code =
      "TIMEOUT";

    next.status = 504;

    return next;
  }

  // ----------------------------------------
  // AI SERVICE UNAVAILABLE
  // ----------------------------------------

  if (status === 503) {
    next.code =
      backendCode ||
      "AI_SERVICE_UNAVAILABLE";

    next.status = 503;

    return next;
  }

  // ----------------------------------------
  // OTHER SERVER ERRORS
  // ----------------------------------------

  if (
    typeof status === "number" &&
    status >= 500
  ) {
    next.code =
      backendCode ||
      "SERVER";

    next.status =
      status;

    return next;
  }

  // ----------------------------------------
  // DEFAULT
  // ----------------------------------------

  next.code =
    backendCode ||
    "API";

  next.status =
    status || 0;

  return next;
}

// ==========================================
// AUTH
// ==========================================

export async function loginUser(
  payload
) {
  try {
    const response =
      await api.post(
        "/auth/login",
        payload
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function signupUser(
  payload
) {
  try {
    const response =
      await api.post(
        "/auth/signup",
        payload
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function getCurrentUser() {
  try {
    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function logoutUser() {
  try {
    await api.post(
      "/auth/logout"
    );
  } catch {
    // Local logout can still
    // complete safely.
  }
}

// ==========================================
// ANALYSIS
// ==========================================

export async function analyzeMessage(
  payload
) {
  const type =
    payload?.type ||
    "message";

  // ----------------------------------------
  // SCREENSHOT
  // ----------------------------------------

  if (type === "screenshot") {
    if (!payload?.file) {
      const error = new Error(
        "Please upload a screenshot to analyze."
      );

      error.code = "VALIDATION";

      throw error;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      payload.file,
      payload.file.name
    );

    formData.append(
      "inputType",
      "screenshot"
    );

    try {
      const response =
        await api.post(
          "/analysis",
          formData,
          {
            timeout: 30000,

            // IMPORTANT:
            // Do not force application/json
            // for multipart/form-data.
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  // ----------------------------------------
  // MESSAGE / URL
  // ----------------------------------------

  const value =
    payload?.message?.trim();

  if (!value) {
    const error =
      new Error(
        type === "url"
          ? "Please paste a URL to analyze."
          : "Please enter something to analyze."
      );

    error.code =
      "VALIDATION";

    throw error;
  }

  if (
    type === "url" &&
    !URL_PATTERN.test(value)
  ) {
    const error =
      new Error(
        "That doesn't look like a valid URL."
      );

    error.code =
      "VALIDATION";

    throw error;
  }

  try {
    const response =
      await api.post(
        "/analysis",
        {
          inputType: type,
          originalInput:
            value,
        }
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

// ==========================================
// HISTORY
// ==========================================

export async function getHistory() {
  try {
    const response =
      await api.get(
        "/history"
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

export async function getAnalytics() {
  try {
    const response =
      await api.get(
        "/analytics/dashboard"
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export default api;
export async function getHistoryDetails(id) {
  try {
    const response =
      await api.get(
        `/history/${id}`
      );

    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

