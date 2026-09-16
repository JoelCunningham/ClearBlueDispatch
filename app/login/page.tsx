import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/routes";

  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      redirect("/login?error=Invalid%20credentials");
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=Invalid%20email%20or%20password");
      }

      throw error;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Sign in</h1>

          <p className="text-sm text-muted-foreground">Sign in to Clear Blue Dispatch.</p>
        </div>

        {params.error && <p className="text-sm text-destructive">{params.error}</p>}

        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
