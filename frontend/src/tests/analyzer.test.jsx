import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockAnalyze = vi.fn();

vi.mock("../services/api", () => ({
  analyzeMessage: (...args) => mockAnalyze(...args),
}));

vi.mock("../context/SettingsContext", () => ({
  useSettings: () => ({
    settings: { threatMonitoring: true },
  }),
}));

vi.mock("lucide-react", () => {
  const Icon = () => <span />;
  return {
    Link2: Icon,
    MessageSquare: Icon,
    Image: Icon,
    ScanLine: Icon,
    ShieldAlert: Icon,
    CheckCircle2: Icon,
    UploadCloud: Icon,
    X: Icon,
    RotateCcw: Icon,
  };
});

import Analyze from "../pages/Analyze";

function renderAnalyze() {
  return render(
    <MemoryRouter>
      <Analyze />
    </MemoryRouter>
  );
}

describe("Analyzer user behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires a message before analysis", async () => {
    const user = userEvent.setup();
    renderAnalyze();

    await user.click(
      screen.getByRole("button", { name: /Analyze signal/i })
    );

    expect(
      screen.getByRole("alert").textContent
    ).toContain("Please enter a message to analyze.");

    expect(mockAnalyze).not.toHaveBeenCalled();
  });

  it("submits a message and renders the security result", async () => {
    const user = userEvent.setup();

    mockAnalyze.mockResolvedValueOnce({
      data: {
        result: {
          severity: "HIGH",
          riskScore: 87,
          confidence: 0.96,
          scamType: "Phishing",
          classification: "SCAM",
          explanation: "Suspicious credential request.",
          redFlags: ["Urgency", "Credential request"],
          recommendedActions: ["Do not click the link"],
        },
      },
    });

    renderAnalyze();

    await user.type(
      screen.getByLabelText("Paste the suspicious message"),
      "Your account will be blocked. Verify your password immediately."
    );

    await user.click(
      screen.getByRole("button", { name: /Analyze signal/i })
    );

    await waitFor(() => {
      expect(screen.getByText("87")).toBeTruthy();
      expect(screen.getByText("HIGH")).toBeTruthy();
      expect(screen.getByText(/Phishing/)).toBeTruthy();
      expect(screen.getByText("SCAM")).toBeTruthy();
      expect(
        screen.getByText("Suspicious credential request.")
      ).toBeTruthy();
    });

    expect(mockAnalyze).toHaveBeenCalledWith({
      message:
        "Your account will be blocked. Verify your password immediately.",
      type: "message",
      file: null,
    });
  });

  it("switches to URL analyzer and validates empty URL", async () => {
    const user = userEvent.setup();
    renderAnalyze();

    await user.click(screen.getByRole("tab", { name: "URL" }));

    expect(
      screen.getByLabelText("Paste the suspicious URL")
    ).toBeTruthy();

    await user.click(
      screen.getByRole("button", { name: /Analyze signal/i })
    );

    expect(
      screen.getByRole("alert").textContent
    ).toContain("Please enter a URL to analyze.");

    expect(mockAnalyze).not.toHaveBeenCalled();
  });

  it("shows API errors and allows retry", async () => {
    const user = userEvent.setup();

    mockAnalyze
      .mockRejectedValueOnce(new Error("Network failure"))
      .mockResolvedValueOnce({
        data: {
          result: {
            severity: "LOW",
            riskScore: 12,
            confidence: 0.91,
            scamType: "Safe",
            classification: "SAFE",
            explanation: "No significant threat detected.",
            redFlags: [],
            recommendedActions: [],
          },
        },
      });

    renderAnalyze();

    await user.type(
      screen.getByLabelText("Paste the suspicious message"),
      "Hello, how are you?"
    );

    await user.click(
      screen.getByRole("button", { name: /Analyze signal/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Analysis failed")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Retry/i })
      ).toBeTruthy();
    });

    await user.click(
      screen.getByRole("button", { name: /Retry/i })
    );

    await waitFor(() => {
      expect(screen.getByText("12")).toBeTruthy();
      expect(screen.getByText("SAFE")).toBeTruthy();
    });

    expect(mockAnalyze).toHaveBeenCalledTimes(2);
  });
});
