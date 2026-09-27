"use client";

import { suppressEvent } from "@/lib/utils/event-utils";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      suppressEvent(event);
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  }

  if (isInstalled || !installPrompt) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
    >
      <Download className="size-4" />
      Install Clear Blue Dispatch
    </button>
  );
}
