import { requireUser } from "@/lib/auth/require-user";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <p className="mt-4">
        Signed in as {user.name ?? user.email}
      </p>

      <p className="text-sm text-muted-foreground">
        Role: {user.role}
      </p>
    </main>
  );
}