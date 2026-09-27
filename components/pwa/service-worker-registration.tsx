"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") return;

    let registration: ServiceWorkerRegistration | undefined;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(swRegistration => {
          registration = swRegistration;
          return swRegistration.update();
        })
        .catch(error => {
          console.error("Service worker registration failed:", error);
        });
    });

    return () => {
      registration = undefined;
    };
  }, []);

  return null;
}
