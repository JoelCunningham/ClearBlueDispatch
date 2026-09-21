import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import LoginForm from "@/components/forms/login-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { LoginFormInput } from "@/features/login/types";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/routes";

  async function login(input: LoginFormInput) {
    "use server";

    try {
      await signIn("credentials", { email: input.email, password: input.password, redirectTo: callbackUrl });
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
      <Heading title="Sign in" subtitle="Sign in to your Clear Blue Dispatch account" />
      <LoginForm initialError={params.error} action={login} />
    </Page>
  );
}
