import { AuthError } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import LoginForm from "@/components/forms/login-form";
import InstallButton from "@/components/pwa/install-button";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { LoginUserInput } from "@/features/login/types";
import { checkUser } from "@/lib/auth/authorization";
import { getSafeCallbackUrl } from "@/lib/utils/url-utils";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl("/routes", params.callbackUrl);

  if (await checkUser()) redirect(callbackUrl);

  async function login(input: LoginUserInput) {
    "use server";

    try {
      await signIn("credentials", { ...input, password: input.password, redirectTo: callbackUrl });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return { success: false, error: "Invalid email or password." };
      }
      throw error;
    }
  }

  return (
    <Page centred>
      <Image src="/icons/logo.png" alt="Clear Blue Dispatch Logo" width={394} height={344} className="mb-4 -mt-16 w-36" loading="eager" />
      <Heading title="Sign in" subtitle="Sign in to your Clear Blue Dispatch account" />
      <LoginForm initialError={params.error} action={login} />
      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
        Forgot your password?
      </Link>
      <div className="mt-6">
        <InstallButton />
      </div>
    </Page>
  );
}
