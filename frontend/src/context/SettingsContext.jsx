import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);
const STORAGE_KEY = "scamshield:settings";

const defaults = {
  threatMonitoring: true,
  riskNotifications: true,
  criticalAlerts: true,
  weeklySummary: true,
};

function readStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Keep the in-memory settings working if browser storage is unavailable.
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
    setSettings(prev => ({ ...prev, [key]: Boolean(value) }));
  };

  const resetSettings = () => setSettings(defaults);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
