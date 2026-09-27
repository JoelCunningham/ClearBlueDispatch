"use client";

import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    let restoredTimeout: number | undefined;

    function handleOffline() {
      if (restoredTimeout !== undefined) window.clearTimeout(restoredTimeout);
      setIsOnline(false);
      setShowRestored(false);
    }

    function handleOnline() {
      setIsOnline(true);
      setShowRestored(true);

      if (restoredTimeout !== undefined) window.clearTimeout(restoredTimeout);
      restoredTimeout = window.setTimeout(() => {
        setShowRestored(false);
      }, 3000);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if (restoredTimeout !== undefined) window.clearTimeout(restoredTimeout);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-2" role="status" aria-live="polite">
      <div className="rounded-md border bg-background px-4 py-2 text-center text-sm font-medium shadow-sm">
        {isOnline ? (
          "Back online"
        ) : (
          <>
            <div>You're offline</div>
            <div className="mt-0.5 text-xs font-normal text-muted-foreground">Changes cannot be saved until you're back online.</div>
          </>
        )}
      </div>
    </div>
  );
}
