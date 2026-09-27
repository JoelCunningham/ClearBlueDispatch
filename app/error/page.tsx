"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      reset();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [reset]);

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">{isOnline ? "Something went wrong" : "You're offline"}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isOnline ? "We couldn't load this page. Please try again." : "Check your internet connection and try again."}
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
