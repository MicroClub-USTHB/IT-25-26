import { useState, useEffect, useCallback } from "react";

export type PermissionStatus = NotificationPermission | "unsupported";

/**
 * Hook to manage and request browser notification permissions.
 * Provides a clean interface for UI components to handle different permission states.
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<PermissionStatus>("default");

  const updatePermission = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    updatePermission();
    
    // Some browsers allow changing permissions without reload (rare but possible via settings)
    // We can't easily listen to permission changes, but we check on focus.
    window.addEventListener("focus", updatePermission);
    return () => window.removeEventListener("focus", updatePermission);
  }, [updatePermission]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return {
    permission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isUnsupported: permission === "unsupported",
    isDefault: permission === "default",
    requestPermission,
    refresh: updatePermission,
  };
}
