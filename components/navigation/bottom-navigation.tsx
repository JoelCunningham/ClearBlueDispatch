"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Settings2, UserRound } from "lucide-react";

const navigationItems = [
  {
    label: "Routes",
    href: "/routes",
    icon: Map
  },
  {
    label: "Manage",
    href: "/manage",
    icon: Settings2
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-t bg-background sticky bottom-0">
      <div className="mx-auto flex max-w-lg">
        {navigationItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 px-4 py-3 text-sm ${isActive ? "font-medium text-primary" : "text-muted-foreground"}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
