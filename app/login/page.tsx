import { AuthError } from "next-auth";
import Image from "next/image";

import { signIn } from "@/auth";
import LoginForm from "@/components/forms/login-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { LoginFormInput } from "@/features/login/types";
import { isFirstTimeLogin, setPassword } from "@/features/login/actions";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; email?: string; firstTimeLogin?: boolean; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/routes";

  async function login(input: LoginFormInput) {
    "use server";

    try {
      const firstTimeLogin = await isFirstTimeLogin({ ...input });

      if (firstTimeLogin && !params.firstTimeLogin) {
        redirect(`/login?email=${encodeURIComponent(input.email)}&firstTimeLogin=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      if (firstTimeLogin && params.firstTimeLogin) {
        const result = await setPassword({ ...input });
        if (!result.success) return result;
      }

      await signIn("credentials", { ...input, password: firstTimeLogin ? input.newPassword : input.password, redirectTo: callbackUrl });
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
      <LoginForm initialError={params.error} action={login} requiresNewPassword={params.firstTimeLogin} email={params.email} />
    </Page>
  );
}
