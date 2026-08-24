import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockAuth = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuth(),
}));

vi.mock("../pages/Home", () => ({ default: () => <div>HOME_PAGE</div> }));
vi.mock("../pages/Login", () => ({ default: () => <div>LOGIN_PAGE</div> }));
vi.mock("../pages/Signup", () => ({ default: () => <div>SIGNUP_PAGE</div> }));
vi.mock("../pages/Dashboard", () => ({ default: () => <div>DASHBOARD_PAGE</div> }));
vi.mock("../components/Sidebar", () => ({ default: () => <div /> }));
vi.mock("../components/Topbar", () => ({ default: () => <div /> }));

import App from "../App";

describe("ScamShield protected routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects logged-out users away from protected routes", async () => {
    mockAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("HOME_PAGE")).toBeTruthy();
    });
  });

  it("allows authenticated users to access dashboard", async () => {
    mockAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("DASHBOARD_PAGE")).toBeTruthy();
    });
  });
});
