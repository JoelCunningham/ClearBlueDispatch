"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref: string;
};

export default function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button type="button" onClick={goBack} className="text-sm text-muted-foreground hover:text-foreground m-0">
      <MoveLeft className="inline h-4 w-4 mb-0.5" /> Back
    </button>
  );
}
