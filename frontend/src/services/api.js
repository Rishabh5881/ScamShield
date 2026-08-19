import axios from "axios";
import { mockAnalysisResults } from "../data/mockData";

const api = axios.create({
  // In development Vite proxies this path to the backend. This avoids a
  // browser CORS failure while still allowing a deployed API URL to be set.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("scamshield:auth");
    const auth = raw ? JSON.parse(raw) : null;
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
    // Ignore malformed local auth storage; the backend will return 401 when required.
  }
  return config;
});

const URL_PATTERN = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

function normalizeError(error) {
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message;
  return message || "Unable to connect to ScamShield backend.";
}

export async function loginUser(payload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    const next = new Error(normalizeError(error));
    next.code = error?.response?.status === 401 ? "AUTH" : "NETWORK";
    throw next;
  }
}

export async function signupUser(payload) {
  try {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  } catch (error) {
    const next = new Error(normalizeError(error));
    next.code = error?.response?.status === 409 ? "CONFLICT" : "NETWORK";
    throw next;
  }
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Local logout still completes if the backend token is already expired.
  }
}

export async function analyzeMessage(payload) {
  const type = payload?.type || "message";

  if (type === "screenshot") {
    if (!payload?.file) {
      const error = new Error("Please upload a screenshot to analyze.");
      error.code = "VALIDATION";
      throw error;
    }

    const formData = new FormData();
    formData.append("inputType", "screenshot");
    formData.append("file", payload.file);
    const response = await api.post("/analysis", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  const value = payload?.message?.trim();
  if (!value) {
    const error = new Error(type === "url" ? "Please paste a URL to analyze." : "Please enter something to analyze.");
    error.code = "VALIDATION";
    throw error;
  }
  if (type === "url" && !URL_PATTERN.test(value)) {
    const error = new Error("That doesn't look like a valid URL.");
    error.code = "VALIDATION";
    throw error;
  }

  try {
    const response = await api.post("/analysis", {
      inputType: type,
      originalInput: value,
    });
    return response.data;
  } catch (error) {
    const next = new Error(normalizeError(error));
    next.code = error?.response?.status === 401 ? "AUTH" : "API";
    throw next;
  }
}

export async function getHistory() {
  const response = await api.get("/history");
  return response.data;
}

export async function getAnalytics() {
  const response = await api.get("/analytics");
  return response.data;
}

export { mockAnalysisResults };
export default api;
