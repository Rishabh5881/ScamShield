import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

describe("Logout user behavior", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("logs the user out and clears the stored session", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "scamshield:auth",
      JSON.stringify({
        accessToken: "test-token",
        user: {
          id: "user-1",
          email: "test@example.com",
        },
      })
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", {
      name: /logout/i,
    });

    await user.click(logoutButton);

    expect(localStorage.getItem("scamshield:auth")).toBeNull();
  });
});
