"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";

interface CardProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  avatarText?: string;
  href?: string;
  children?: React.ReactNode;
  childrenPosition?: "right" | "bottom";
}

export default function Card({ title, subtitle, avatar, avatarText, href, children, childrenPosition = "right" }: CardProps) {
  const WrapperElement = href ? Link : "div";
  return (
    <WrapperElement
      href={href ? href : "/"}
      className={`rounded-lg border p-4 transition-colors hover:bg-muted items-center gap-4  ${childrenPosition === "bottom" ? "block" : "flex"}`}
    >
      {(avatar || avatarText) && (
        <div className="flex size-10 shrink-0 items-center justify-center self-start rounded-full bg-primary text-md font-semibold text-primary-foreground my-auto">
          {avatar || avatarText}
        </div>
      )}

      {title && (
        <div className="min-w-0 flex-1">
          <p className="font-medium">{title}</p>
          {subtitle && <p className="truncate text-left text-sm text-muted-foreground hover:text-foreground hover:underline">{subtitle}</p>}
        </div>
      )}

      {children && childrenPosition === "right" && children}
      {!children && childrenPosition === "right" && href && <MoveRight className="shrink-0 text-muted-foreground" />}
      {children && childrenPosition === "bottom" && <div className="mt-4">{children}</div>}
    </WrapperElement>
  );
}
