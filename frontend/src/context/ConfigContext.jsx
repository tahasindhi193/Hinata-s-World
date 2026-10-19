import { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CONFIG } from "../data/defaultConfig";

const STORAGE_KEY = "muskan_app_config_v1";

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load config from localStorage:", e);
    }
    return DEFAULT_CONFIG;
  });

  // Automatically save to localStorage when config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn("Failed to persist config to localStorage:", e);
    }
  }, [config]);

  // Update a single section (e.g. welcome, envelope, quiz, surprise, etc.)
  const updateSection = (section, data) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  // Replace entire config (e.g. when importing JSON)
  const replaceConfig = (newConfig) => {
    setConfig(newConfig);
  };

  // Reset to original default configuration
  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateSection,
        replaceConfig,
        resetToDefaults,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return ctx;
}
