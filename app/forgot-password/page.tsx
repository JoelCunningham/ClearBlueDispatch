import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import ResetPasswordForm from "@/components/forms/reset-password-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { ResetPasswordInput } from "@/features/login/types";
import { checkUser } from "@/lib/auth/authorization";
import { resetPassword } from "@/features/login/actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  if (await checkUser()) redirect("/routes");

  async function forgotPassword(input: ResetPasswordInput) {
    "use server";
    return resetPassword(input);
  }

  return (
    <Page centred>
      <Heading title="Reset Password" subtitle="A reset link will be sent to your email." logo />
      <ResetPasswordForm initialError={params.error} action={forgotPassword} />
      <Link href="/login" className="text-sm text-primary hover:underline">
        Back to Login
      </Link>
    </Page>
  );
}
