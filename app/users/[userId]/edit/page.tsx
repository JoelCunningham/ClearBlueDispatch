import PrimaryButton from "@/components/buttons/primary-button";
import PasswordForm from "@/components/forms/password-form";
import UserForm from "@/components/forms/user-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { deleteUser, resetUserPassword, updateUser } from "@/features/users/actions";
import { getUser } from "@/features/users/queries";
import { PasswordFormInput, UserFormInput } from "@/features/users/types";
import { requireRole } from "@/lib/auth/authorization";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";
import { redirect } from "next/navigation";

type EditUserPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const manager = await requireRole("MANAGER");
  const { userId } = await params;

  const userIdNumber = idOrNotFound(userId);
  const user = valueOrNotFound(await getUser(userIdNumber));

  if (user.deleted) redirect(`/users/${userIdNumber}`);

  const isSelf = manager.id === user.id;

  async function updateUserDetails(input: UserFormInput) {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return updateUser({ ...input, userId: user.id });
  }

  async function resetPassword(input: PasswordFormInput) {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return resetUserPassword({ userId: user.id, newPassword: input.newPassword });
  }

  async function deleteUserProfile() {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return deleteUser({ userId: user.id });
  }

  return (
    <Page>
      <Heading title="Edit User" backFallback="/users" />
      <UserForm name={user.name} email={user.email} role={user.role} canEditRole={!isSelf} action={updateUserDetails} />
      <PasswordForm requireCurrentPassword={false} action={resetPassword} />
      <PrimaryButton text="Delete user" destructive={true} onClick={deleteUserProfile} />
    </Page>
  );
}
