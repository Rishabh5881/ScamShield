import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const mockLogin = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("../components/BrandMark", () => ({
  default: () => <div>BRAND</div>,
}));

import Login from "../pages/Login";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>DASHBOARD_SUCCESS</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login user behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents submission when credentials are empty", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("prevents submission when email format is invalid", async () => {
    const user = userEvent.setup();
    renderLogin();

    const email = screen.getByLabelText("Email");

    await user.type(email, "invalid-email");
    await user.type(screen.getByLabelText("Password"), "123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(email.checkValidity()).toBe(false);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits valid credentials and navigates to dashboard", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValueOnce({
      user: { id: "1" },
      token: "test-token",
    });

    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "123456",
      });
    });

    expect(screen.getByText("DASHBOARD_SUCCESS")).toBeTruthy();
  });

  it("shows backend login errors to the user", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert").textContent
      ).toContain("Invalid credentials");
    });
  });
});
