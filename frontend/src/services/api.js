import axios from "axios";

const api = axios.create({
  // Use the configured API URL when deployed.
  // In development, Vite proxies /api to the backend.
  baseURL: import.meta.env.VITE_API_URL || "/api",

  // Screenshot/AI analysis can take longer than normal API requests.
  timeout: 120000,

  headers: {
    "Content-Type": "application/json",
  },

  // Supports cookie-based authentication when required.
  withCredentials: true,
});

// ==========================================
// AUTH TOKEN INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("scamshield:auth");
      const auth = raw ? JSON.parse(raw) : null;

      if (auth?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {
      // Ignore malformed local auth storage.
      // Backend will return 401 when authentication is required.
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// HELPERS
// ==========================================

const URL_PATTERN =
  /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

function normalizeError(error) {
  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT"
  ) {
    return "Request timed out. Please try again.";
  }

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  return (
    message ||
    "Unable to connect to ScamShield backend."
  );
}

// ==========================================
// AUTH
// ==========================================

export async function loginUser(payload) {
  try {
    const response = await api.post(
      "/auth/login",
      payload
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 401
        ? "AUTH"
        : "NETWORK";

    throw next;
  }
}

export async function signupUser(payload) {
  try {
    const response = await api.post(
      "/auth/signup",
      payload
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 409
        ? "CONFLICT"
        : "NETWORK";

    throw next;
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 401
        ? "AUTH"
        : "API";

    throw next;
  }
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Local logout can still complete
    // when the backend token has expired.
  }
}

// ==========================================
// ANALYSIS
// ==========================================

export async function analyzeMessage(payload) {
  const type = payload?.type || "message";

  // ------------------------------------------
  // SCREENSHOT ANALYSIS
  // ------------------------------------------

  if (type === "screenshot") {
    if (!payload?.file) {
      const error = new Error(
        "Please upload a screenshot to analyze."
      );

      error.code = "VALIDATION";
      throw error;
    }

    const formData = new FormData();

    formData.append(
      "inputType",
      "screenshot"
    );

    formData.append(
      "file",
      payload.file
    );

    try {
      const response = await api.post(
        "/analysis",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
          timeout: 120000,
        }
      );

      return response.data;
    } catch (error) {
      const next = new Error(
        normalizeError(error)
      );

      if (
        error?.response?.status === 401
      ) {
        next.code = "AUTH";
      } else if (
        error?.response?.status >= 500
      ) {
        next.code = "SERVER";
      } else if (
        error?.code === "ECONNABORTED" ||
        error?.code === "ETIMEDOUT"
      ) {
        next.code = "TIMEOUT";
      } else {
        next.code = "API";
      }

      throw next;
    }
  }

  // ------------------------------------------
  // MESSAGE / URL ANALYSIS
  // ------------------------------------------

  const value =
    payload?.message?.trim();

  if (!value) {
    const error = new Error(
      type === "url"
        ? "Please paste a URL to analyze."
        : "Please enter something to analyze."
    );

    error.code = "VALIDATION";
    throw error;
  }

  if (
    type === "url" &&
    !URL_PATTERN.test(value)
  ) {
    const error = new Error(
      "That doesn't look like a valid URL."
    );

    error.code = "VALIDATION";
    throw error;
  }

  try {
    const response = await api.post(
      "/analysis",
      {
        inputType: type,
        originalInput: value,
      }
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 401
        ? "AUTH"
        : "API";

    throw next;
  }
}

// ==========================================
// HISTORY
// ==========================================

export async function getHistory() {
  try {
    const response = await api.get(
      "/history"
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 401
        ? "AUTH"
        : "API";

    throw next;
  }
}

// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

export async function getAnalytics() {
  try {
    const response = await api.get(
      "/analytics/dashboard"
    );

    return response.data;
  } catch (error) {
    const next = new Error(
      normalizeError(error)
    );

    next.code =
      error?.response?.status === 401
        ? "AUTH"
        : "API";

    throw next;
  }
}

export default api;