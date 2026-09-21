import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface LinkButtonProps {
  text?: string;
  icon?: LucideIcon;
  href: string;
  secondary?: boolean;
}

export default function LinkButton({ text, icon: Icon, href, secondary }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`block rounded-lg text-center text-sm font-medium ${secondary ? "border" : "bg-primary text-primary-foreground"} px-4 py-3`}
    >
      {Icon && <Icon className={`inline h-4 w-4 ${text ? "mb-1" : ""}`} />} {text}
    </Link>
  );
}
