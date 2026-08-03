"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { fetchJson } from "@/lib/fetch-json";
import type { SiteSettings } from "@/lib/site-links";

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await fetchJson<SiteSettings>("/api/settings");
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (e) {
      console.error("Failed to refresh site settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchJson<SiteSettings>("/api/settings");
        if (active) {
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        }
      } catch {
        if (active) {
          setSettings(DEFAULT_SETTINGS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const handleRefresh = () => {
      void refresh();
    };

    window.addEventListener("site-settings-updated", handleRefresh);
    void load();

    return () => {
      active = false;
      window.removeEventListener("site-settings-updated", handleRefresh);
    };
  }, []);

  return <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}