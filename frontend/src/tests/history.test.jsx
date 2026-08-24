import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import History from "../pages/History";

vi.mock("../services/api", () => ({
  getAnalysisHistory: vi.fn().mockResolvedValue([
    {
      id: "analysis-1",
      inputType: "message",
      status: "COMPLETED",
      createdAt: "2026-08-24T10:00:00.000Z",
      result: {
        classification: "SCAM",
        severity: "HIGH",
        riskScore: 87,
        scamType: "Phishing",
      },
    },
  ]),
}));

describe("History user behavior", () => {
  it("renders analysis history", async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/87|HIGH|Phishing/i)
    ).toBeTruthy();
  });
});
