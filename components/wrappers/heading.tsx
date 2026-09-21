import { LucideIcon, MoveLeft } from "lucide-react";
import Link from "next/link";

import { checkUserRole } from "@/lib/auth/authorization";
import { UserRole } from "@/types/next-auth";

interface HeadingProps {
  title: string;
  subtitle?: string;
  subtitleIcon?: LucideIcon;
  backLink?: LinkProps;
  actionLink?: LinkProps;
  children?: React.ReactNode;
}

interface LinkProps {
  text: string;
  href: string;
  role?: UserRole;
}

export default async function Heading({ title, subtitle, subtitleIcon: SubtitleIcon, backLink, actionLink, children }: HeadingProps) {
  const role = await checkUserRole();

  return (
    <div className="mb-6 space-y-2 w-full">
      {backLink && (backLink.role ? role === backLink.role : true) && (
        <Link href={backLink.href} className="text-sm text-muted-foreground hover:text-foreground">
          <MoveLeft className="inline-block h-4 w-4" /> Back to {backLink.text}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4 mt-2 w-full">
        <div>
          <h1 className="text-2xl font-semibold mb-1 w-full">{title}</h1>
          <div className="flex items-center gap-1">
            {SubtitleIcon && <SubtitleIcon height={18} width={18} />}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {actionLink && (actionLink.role ? role === actionLink.role : true) && (
          <Link href={actionLink.href} className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {actionLink.text}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
