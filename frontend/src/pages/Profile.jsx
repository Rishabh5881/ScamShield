import { useState } from "react";
import { ShieldCheck, UserRound, Bell, LockKeyhole, Check, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [saveMessage, setSaveMessage] = useState("");
  const name = user?.name || "Akshh";
  const email = user?.email || "you@example.com";
  const initial = name.charAt(0).toUpperCase();

  const changeSetting = (key, value) => {
    updateSetting(key, value);
    setSaveMessage(`${value ? "Enabled" : "Disabled"} â€” saved automatically.`);
  };

  const restoreDefaults = () => {
    resetSettings();
    setSaveMessage("Default preferences restored and saved.");
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Account / 05</span>
          <h1>Your security profile.</h1>
          <p>Manage your profile and protection preferences. Changes are saved automatically.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="avatar large">{initial}</div>
        <div><h2>{name}</h2><p>Security Analyst Â· ScamShield AI</p></div>
        <span className={`profile-status ${settings.threatMonitoring ? "" : "paused"}`}><ShieldCheck size={13} /> {settings.threatMonitoring ? "Protection active" : "Protection paused"}</span>
      </section>

      <section className="profile-settings">
        <article className="panel setting-panel">
          <div className="setting-heading"><UserRound size={17} /><div><h3>Account details</h3><p>Your current account information.</p></div></div>
          <div className="detail-list">
            <div><span>Display name</span><strong>{name}</strong></div>
            <div><span>Email</span><strong>{email}</strong></div>
            <div><span>Role</span><strong>Security Analyst</strong></div>
          </div>
        </article>

        <article className="panel setting-panel">
          <div className="setting-heading"><LockKeyhole size={17} /><div><h3>Protection</h3><p>Control how ScamShield monitors threats.</p></div></div>
          <div className="setting-list">
            <div className="setting-row">
              <div><strong>Threat monitoring</strong><span>Keep security monitoring enabled.</span></div>
              <Toggle label="Threat monitoring" checked={settings.threatMonitoring} onChange={v => changeSetting("threatMonitoring", v)} />
            </div>
            <div className="setting-row">
              <div><strong>Risk notifications</strong><span>Show alerts when a risk signal is detected.</span></div>
              <Toggle label="Risk notifications" checked={settings.riskNotifications} onChange={v => changeSetting("riskNotifications", v)} />
            </div>
          </div>
        </article>

        <article className="panel setting-panel">
          <div className="setting-heading"><Bell size={17} /><div><h3>Notifications</h3><p>Choose which security updates you receive.</p></div></div>
          <div className="setting-list">
            <div className="setting-row">
              <div><strong>Critical threat alerts</strong><span>Immediate warnings for critical detections.</span></div>
              <Toggle label="Critical threat alerts" checked={settings.criticalAlerts} onChange={v => changeSetting("criticalAlerts", v)} />
            </div>
            <div className="setting-row">
              <div><strong>Weekly security summary</strong><span>A weekly overview of your protection activity.</span></div>
              <Toggle label="Weekly security summary" checked={settings.weeklySummary} onChange={v => changeSetting("weeklySummary", v)} />
            </div>
          </div>
        </article>
      </section>

      <section className="profile-actions">
        <div aria-live="polite"><Check size={14} /> {saveMessage || "Settings are stored locally in this browser."}</div>
        <button className="ghost-btn" type="button" onClick={restoreDefaults}><RotateCcw size={13} /> Reset preferences</button>
      </section>
    </main>
  );
}
