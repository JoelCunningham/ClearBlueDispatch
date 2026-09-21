import Link from "next/link";
import { notFound } from "next/navigation";

import { resetUserPassword, updateUser } from "@/features/users/actions";
import { getUser } from "@/features/users/queries";
import { requireRole } from "@/lib/auth/authorization";
import { UserForm } from "@/components/forms/user-form";
import { PasswordForm } from "@/components/forms/password-form";

type EditUserPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const manager = await requireRole("MANAGER");

  const { userId } = await params;
  const userIdNumber = Number(userId);

  if (!Number.isInteger(userIdNumber)) {
    notFound();
  }

  const user = await getUser(userIdNumber);

  if (!user) {
    notFound();
  }

  const isSelf = manager.id === user.id;

  async function updateUserDetails(input: { name: string; email: string; role: "DRIVER" | "MANAGER" }) {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return updateUser({ ...input, userId: user.id });
  }

  async function resetPassword(input: { currentPassword?: string; newPassword: string }) {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return resetUserPassword({
      userId: user.id,
      newPassword: input.newPassword
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href={`/manage/users/${user.id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← User Profile
        </Link>

        <div className="pt-2">
          <h1 className="text-2xl font-semibold">Edit User</h1>
          <p className="text-sm text-muted-foreground">Manage this user&apos;s account details and password.</p>
        </div>
      </div>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Account details</h2>

        <UserForm name={user.name} email={user.email} role={user.role} canEditRole={!isSelf} action={updateUserDetails} />
      </section>

      <section className="mt-6 rounded-lg border p-4">
        <h2 className="mb-1 font-semibold">Reset password</h2>

        <p className="mb-4 text-sm text-muted-foreground">Set a new password for this user. Their current password is not required.</p>

        <PasswordForm requireCurrentPassword={false} action={resetPassword} />
      </section>
    </main>
  );
}
