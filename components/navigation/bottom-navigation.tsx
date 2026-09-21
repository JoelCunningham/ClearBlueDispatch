"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Settings2, UserRound } from "lucide-react";
import { User } from "next-auth";

const navigationItems = [
  {
    label: "Routes",
    href: "/routes",
    icon: Map,
    roles: ["DRIVER", "MANAGER"]
  },
  {
    label: "Manage",
    href: "/manage",
    icon: Settings2,
    roles: ["MANAGER"]
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    roles: ["DRIVER", "MANAGER"]
  }
];

interface BottomNavigationProps {
  user: User;
}

export function BottomNavigation({ user }: BottomNavigationProps) {
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="border-t bg-background shrink-0">
      <div className="mx-auto flex max-w-lg">
        {navigationItems.map(item => {
          if (!item.roles.includes(user.role.toString())) return null;

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 px-4 py-3 text-sm ${
                isActive ? "font-medium text-primary" : "text-muted-foreground"
              }`}
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
