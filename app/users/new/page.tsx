import UserForm from "@/components/forms/user-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { createUser } from "@/features/users/actions";
import { UserFormInput } from "@/features/users/types";
import { requireRole } from "@/lib/auth/authorization";

export default async function CreateUserPage() {
  await requireRole("MANAGER");

  async function submitUser(input: UserFormInput) {
    "use server";
    return await createUser(input);
  }

  return (
    <Page>
      <Heading title="Create delivery" subtitle="Add a delivery to a driver's route." backFallback="/deliveries" />
      <UserForm canEditRole={true} action={submitUser} />
    </Page>
  );
}
