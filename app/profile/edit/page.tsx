import PasswordForm from "@/components/forms/password-form";
import UserForm from "@/components/forms/user-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { changeOwnPassword, updateOwnProfile } from "@/features/users/actions";
import { PasswordFormInput, UpdateOwnProfileInput } from "@/features/users/types";
import { requireUser } from "@/lib/auth/authorization";

export default async function EditProfilePage() {
  const user = await requireUser();

  async function updateProfile(input: UpdateOwnProfileInput) {
    "use server";
    return updateOwnProfile({ ...input, userId: user.id });
  }

  async function changePassword(input: PasswordFormInput) {
    "use server";
    return changeOwnPassword({ ...input });
  }

  return (
    <Page>
      <Heading title="Edit Profile" subtitle="Manage your account details and password" backFallback="/profile" />
      {user.role === "MANAGER" && (
        <UserForm name={user.name} email={user.email} role={user.role} canEditRole={false} action={updateProfile} />
      )}
      <PasswordForm requireCurrentPassword action={changePassword} />
    </Page>
  );
}
