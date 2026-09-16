import { requireRole } from "@/lib/auth/require-role";

export default async function ManagePage() {
  const user = await requireRole("MANAGER");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Manage</h1>
      <p className="mt-4">Welcome, {user.name ?? user.email}.</p>
    </main>
  );
}
