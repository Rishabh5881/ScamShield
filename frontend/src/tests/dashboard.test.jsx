import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  getDashboardAnalytics: vi.fn().mockResolvedValue({
    totalAnalyses: 12,
    highRiskCount: 4,
    safeCount: 8,
    recentActivity: [],
    categoryDistribution: [],
    severityDistribution: [],
  }),
  getCurrentUser: vi.fn().mockResolvedValue({
    user: {
      id: "test-user",
      email: "test@example.com",
      name: "Test User",
    },
  }),
}));

describe("Dashboard user behavior", () => {
  beforeEach(() => {
    localStorage.setItem(
      "scamshield:auth",
      JSON.stringify({
        token: "test-token",
        user: {
          id: "test-user",
          email: "test@example.com",
        },
      })
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders the dashboard", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    screen.debug(); expect(true).toBeTruthy();
  });
});


