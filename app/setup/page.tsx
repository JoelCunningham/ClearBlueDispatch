import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import ErrorAlert from "@/components/alerts/error-alert";
import SetupPasswordForm from "@/components/forms/setup-password-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { setupPassword } from "@/features/login/actions";
import { getUserInvitation } from "@/features/login/queries";
import { SetupPasswordInput } from "@/features/login/types";
import { checkUser } from "@/lib/auth/authorization";
import { getToday } from "@/lib/utils/date-utils";
import { getSafeCallbackUrl } from "@/lib/utils/url-utils";

type SetupPageProps = {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;

  if (await checkUser()) redirect(getSafeCallbackUrl("/profile", params.callbackUrl));
  const user = await getUserInvitation(params.token);

  async function setupPasswordAction(input: SetupPasswordInput) {
    "use server";
    if (!user) return { success: false, error: "This invitation link is invalid." };
    return setupPassword({ ...input, userId: user.id, callbackUrl: getSafeCallbackUrl("/routes", params.callbackUrl) });
  }

  return (
    <Page centred>
      <Image src="/icons/logo.png" alt="Clear Blue Dispatch Logo" width={394} height={344} className="mb-4 -mt-16 w-36" loading="eager" />
      <Heading title="Set your password" subtitle={`Create a password for your account`} />
      {user === null ? (
        <ErrorAlert text="This invitation has already been used. If you need a new invitation, please contact your manager." />
      ) : Temporal.Instant.compare(user.loginTokenExpiry, getToday()) < 0 ? (
        <ErrorAlert text="This invitation has expired. Please contact your manager to request a new invitation." />
      ) : (
        <SetupPasswordForm action={setupPasswordAction} />
      )}
      <Link href="/login" className="text-sm text-primary hover:underline">
        Back to Login
      </Link>
    </Page>
  );
}
