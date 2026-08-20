import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  ShieldCheck,
  UserRound,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandMark from "./BrandMark";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/analyze",
    label: "Analyze",
    icon: ScanSearch,
  },
  {
    to: "/history",
    label: "History",
    icon: History,
  },
  {
    to: "/insights",
    label: "Security Insights",
    icon: ShieldCheck,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: UserRound,
  },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  const onLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-open" : ""
        }`}
        aria-label="Primary navigation"
      >
        {/* ==========================================
            BRAND
            ========================================== */}

        <div className="brand">
          <div className="brand-mark">
            <BrandMark size={19} />
          </div>

          <div>
            <strong>ScamShield AI</strong>
            <span>Signal Intelligence</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        {/* ==========================================
            NAVIGATION
            ========================================== */}

        <div className="nav-label">Workspace</div>

        <nav>
          {links.map(
            ({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={onClose}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* ==========================================
            SPACER
            ========================================== */}

        <div className="sidebar-spacer" />

        {/* ==========================================
            PROTECTION STATUS
            ========================================== */}

        <div
          className="protection"
          title="Protection services are enabled"
        >
          <span className="status-dot" />

          <div>
            <strong>Protection Active</strong>
            <span>Monitoring enabled</span>
          </div>
        </div>

        {/* ==========================================
            SETTINGS
            ========================================== */}

        <button
          className="nav-link"
          type="button"
          onClick={() => navigate("/profile")}
        >
          <Settings
            size={18}
            strokeWidth={1.8}
          />

          <span>Settings</span>
        </button>

        {/* ==========================================
            LOGOUT
            ========================================== */}

        <button
          className="nav-link"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}