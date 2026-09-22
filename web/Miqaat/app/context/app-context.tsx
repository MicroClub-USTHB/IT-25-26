import { createContext, useContext, type ReactNode } from "react";
import { usePrayerTimes, type PrayerAppState } from "~/hooks/use-prayer-times";
import { useNotifications } from "~/hooks/use-notifications";

const AppContext = createContext<PrayerAppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = usePrayerTimes();

  // Wire up browser notifications
  useNotifications(state.prayerTimes, state.notificationsEnabled, state.notificationPreferences);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useAppContext(): PrayerAppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
