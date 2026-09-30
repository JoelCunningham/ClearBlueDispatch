import { readFile } from "fs/promises";
import path from "path";

export async function getLogoBuffer(): Promise<Uint8Array> {
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "icons", "logo.png"));
  return new Uint8Array(logoBuffer);
}

export function getLogoUrl(): string {
  return `${getHostname()}/icons/logo.png`;
}

export function getLoginUrl(token: string): string {
  return `${getHostname()}/setup?token=${encodeURIComponent(token)}`;
}

export function getSafeCallbackUrl(fallback: string, callbackUrl?: string): string {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//") || callbackUrl.includes("\\")) {
    return fallback;
  }
  return callbackUrl;
}

function getHostname(): string {
  return process.env.NODE_ENV === "production" ? (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") : "http://localhost:3000";
}
