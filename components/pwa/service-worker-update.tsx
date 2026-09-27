"use client";

import { useEffect, useState } from "react";

export default function ServiceWorkerUpdate() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    let isMounted = true;

    navigator.serviceWorker.ready.then(readyRegistration => {
      if (!isMounted) return;

      setRegistration(readyRegistration);

      function handleStateChange() {
        if (readyRegistration.waiting) setUpdateAvailable(true);
      }

      if (readyRegistration.waiting) setUpdateAvailable(true);

      readyRegistration.addEventListener("updatefound", () => {
        const newWorker = readyRegistration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", handleStateChange);
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleReload() {
    if (!registration?.waiting) {
      window.location.reload();
      return;
    }

    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        window.location.reload();
      },
      { once: true }
    );
  }

  if (!updateAvailable) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-sm items-center justify-between gap-4 rounded-md border bg-background p-3 text-sm shadow-lg">
        <span>A new version is available.</span>

        <button type="button" onClick={handleReload} className="shrink-0 rounded-md border px-3 py-1.5 font-medium">
          Reload
        </button>
      </div>
    </div>
  );
}
