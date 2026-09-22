import { LucideIcon } from "lucide-react";
import Link from "next/link";

import BackButton from "@/components/buttons/back-button";
import { checkUserRole } from "@/lib/auth/authorization";
import { UserRole } from "@/types/next-auth";

interface HeadingProps {
  title: string;
  subtitle?: string;
  subtitleIcon?: LucideIcon;
  backFallback?: string;
  actionLink?: LinkProps;
  children?: React.ReactNode;
}

interface LinkProps {
  text: string;
  href: string;
  role?: UserRole;
}

export default async function Heading({ title, subtitle, subtitleIcon: SubtitleIcon, backFallback, actionLink, children }: HeadingProps) {
  const role = await checkUserRole();

  return (
    <div className="mb-6 space-y-2 w-full">
      {backFallback && <BackButton fallbackHref={backFallback} />}
      <div className="flex items-start justify-between gap-4 w-full">
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
