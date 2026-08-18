import { useEffect, useRef, useState } from "react";
import { Bell, Search, Menu, Check, ShieldAlert, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useLocation, useNavigate } from "react-router-dom";

const searchItems = [
  { label: "Dashboard", keywords: "dashboard home overview", to: "/dashboard", type: "Page" },
  { label: "Analyze", keywords: "analyze message url screenshot scan", to: "/analyze", type: "Page" },
  { label: "Analysis History", keywords: "history archive previous analyses", to: "/history", type: "Page" },
  { label: "Security Insights", keywords: "insights tips security safety", to: "/insights", type: "Page" },
  { label: "Profile & Protection", keywords: "profile account protection notifications settings", to: "/profile", type: "Page" },
  { label: "SBI verification request", keywords: "sbi phishing critical scam", to: "/history", type: "Analysis" },
  { label: "Delivery address update", keywords: "delivery scam high", to: "/history", type: "Analysis" },
  { label: "Remote developer offer", keywords: "job scam low", to: "/history", type: "Analysis" },
  { label: "Prize confirmation", keywords: "lottery prize critical", to: "/history", type: "Analysis" },
  { label: "Payment verification", keywords: "banking payment high", to: "/history", type: "Analysis" },
];

export default function Topbar({ onMenu }) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const name = user?.name || "Akshh";
  const initial = name.charAt(0).toUpperCase();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef(null);

  const results = query.trim()
    ? searchItems.filter(item => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    setSearchOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
        return;
      }
      // Ctrl/Cmd+K is best-effort because Chrome may intercept it before page JS receives it.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!e.target.closest(".topbar-search-wrap")) setSearchOpen(false);
      if (!e.target.closest(".notification-wrap")) setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const goTo = (to) => {
    setQuery("");
    setSearchOpen(false);
    navigate(to);
  };

  const hasNotifications = settings.criticalAlerts || settings.riskNotifications || settings.weeklySummary;

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={18} /></button>
      <div className="topbar-search-wrap">
        <label className="search-box" aria-label="Search ScamShield">
          <Search size={15} />
          <input ref={searchRef} value={query} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search analyses, threats..." autoComplete="off" />
          <kbd>/</kbd>
          {query && <button className="search-clear" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={12} /></button>}
        </label>
        {searchOpen && query.trim() && (
          <div className="search-results" role="listbox">
            {results.length ? results.map(item => (
              <button key={`${item.type}-${item.label}`} className="search-result" type="button" onClick={() => goTo(item.to)}>
                <span className="search-result-icon"><Search size={12} /></span>
                <span><strong>{item.label}</strong><small>{item.type}</small></span>
              </button>
            )) : <div className="search-empty">No matching ScamShield records.</div>}
          </div>
        )}
      </div>
      <div className="topbar-actions">
        <div className="notification-wrap">
          <button className={`icon-button ${notificationsOpen ? "open" : ""}`} aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(v => !v)}>
            <Bell size={16} />{hasNotifications && <i aria-hidden="true" />}
          </button>
          {notificationsOpen && (
            <div className="notification-popover">
              <div className="notification-head"><div><strong>Notifications</strong><span>Protection preferences</span></div><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={14} /></button></div>
              {settings.criticalAlerts && <button className="notification-item" type="button" onClick={() => goTo("/profile")}><span className="notification-icon critical"><ShieldAlert size={14} /></span><span><strong>Critical alerts enabled</strong><small>You'll be warned about critical threats.</small></span></button>}
              {settings.riskNotifications && <button className="notification-item" type="button" onClick={() => goTo("/profile")}><span className="notification-icon"><Bell size={14} /></span><span><strong>Risk notifications enabled</strong><small>Risk changes will appear here.</small></span></button>}
              {settings.weeklySummary && <button className="notification-item" type="button" onClick={() => goTo("/profile")}><span className="notification-icon"><Check size={14} /></span><span><strong>Weekly summary enabled</strong><small>Your security summary is active.</small></span></button>}
              {!hasNotifications && <div className="notification-empty">All notifications are currently off.</div>}
              <button className="notification-settings" type="button" onClick={() => goTo("/profile")}>Manage notification settings →</button>
            </div>
          )}
        </div>
        <button className="user-mini user-mini-button" type="button" onClick={() => navigate("/profile")} aria-label="Open profile"><div><strong>{name}</strong><span>Security Analyst</span></div><div className="avatar" aria-hidden="true">{initial}</div></button>
      </div>
    </header>
  );
}
