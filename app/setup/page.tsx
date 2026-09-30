import Image from "next/image";

import ErrorAlert from "@/components/alerts/error-alert";
import SetupPasswordForm from "@/components/forms/setup-password-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { setupPassword } from "@/features/login/actions";
import { getUserInvitation } from "@/features/login/queries";
import { SetupPasswordInput } from "@/features/login/types";
import { getToday } from "@/lib/utils/date-utils";
import { getSafeCallbackUrl } from "@/lib/utils/url-utils";
import { valueOrNotFound } from "@/lib/utils/validation-utils";
import { checkUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

type SetupPageProps = {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;

  if (await checkUser()) redirect(getSafeCallbackUrl("/profile", params.callbackUrl));

  const user = valueOrNotFound(await getUserInvitation(params.token));

  async function setupPasswordAction(input: SetupPasswordInput) {
    "use server";
    return setupPassword({ ...input, userId: user.id, callbackUrl: getSafeCallbackUrl("/routes", params.callbackUrl) });
  }

  return (
    <Page centred>
      <Image src="/icons/logo.png" alt="Clear Blue Dispatch Logo" width={394} height={344} className="mb-4 -mt-16 w-36" loading="eager" />
      <Heading title="Set your password" subtitle={`Create a password for your account`} />
      {Temporal.Instant.compare(user.loginTokenExpiry, getToday()) < 0 ? (
        <ErrorAlert text="This invitation has expired. Please contact your manager to request a new invitation." />
      ) : user.passwordHash ? (
        <ErrorAlert text="A password has already been set for this account." />
      ) : (
        <SetupPasswordForm action={setupPasswordAction} />
      )}
    </Page>
  );
}
