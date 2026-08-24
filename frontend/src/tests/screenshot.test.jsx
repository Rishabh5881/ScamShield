import { describe, it, expect, vi, beforeEach } from "vitest";
import {  render, screen , fireEvent } from "@testing-library/react";
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

describe("Screenshot analyzer behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unsupported screenshot file types", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Analyze />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("tab", { name: "Screenshot" })
    );

    const input = screen.getByLabelText("Screenshot input");

    const file = new File(
      ["fake content"],
      "malware.exe",
      { type: "image/gif" }
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByRole("alert").textContent).toContain(
      "Please upload a PNG, JPG or WEBP image."
    );

    expect(mockAnalyze).not.toHaveBeenCalled();
  });

  it("accepts a valid PNG screenshot", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Analyze />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("tab", { name: "Screenshot" })
    );

    const input = screen.getByLabelText("Screenshot input");

    const file = new File(
      ["valid image"],
      "suspicious.png",
      { type: "image/png" }
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("suspicious.png")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Remove file" })
    ).toBeTruthy();
  });
});



