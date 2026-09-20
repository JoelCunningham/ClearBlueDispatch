import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: "Clear Blue Dispatch",
    template: "%s | Clear Blue Dispatch"
  },
  description: "Delivery and docket management for Clear Blue Solutions"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex h-dvh flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
