import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import HistoryDetails from "./pages/HistoryDetails";
import SecurityInsights from "./pages/SecurityInsights";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="main-area">
        <Topbar
          onMenu={() => setMobileOpen(true)}
        />

        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/analyze"
            element={<Analyze />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/history/:id"
            element={<HistoryDetails />}
          />

          <Route
            path="/insights"
            element={<SecurityInsights />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // ==========================================
  // AUTH SESSION RESTORATION
  // ==========================================

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Restoring your session.</h1>

          <p>
            Checking your ScamShield account securely...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PUBLIC / LOGGED-OUT APPLICATION
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Routes>
        {/* PUBLIC HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* PUBLIC ANALYZE */}
        <Route
          path="/analyze"
          element={<Analyze />}
        />
        {/* ANY PROTECTED/UNKNOWN URL AFTER LOGOUT */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    );
  }

  // ==========================================
  // AUTHENTICATED APPLICATION
  // ==========================================

  return (
    <Routes>
      {/* ROOT → DASHBOARD */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* AUTH PAGES → DASHBOARD */}
      <Route
        path="/login"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/signup"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* APPLICATION */}
      <Route
        path="/*"
        element={<AppShell />}
      />
    </Routes>
  );
}
