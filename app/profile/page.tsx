import LogoutButton from "@/components/buttons/logout-button";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import ProfileDetails from "@/features/users/components/profile-details";
import { getUser } from "@/features/users/queries";
import { requireUser } from "@/lib/auth/authorization";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

export default async function ProfilePage() {
  const userId = (await requireUser()).id;

  const userIdNumber = idOrNotFound(userId);
  const user = valueOrNotFound(await getUser(userIdNumber));

  return (
    <Page>
      <Heading title="Profile" subtitle="Manage your account" actionLink={{ text: "Edit", href: "/profile/edit" }} />
      <ProfileDetails name={user.name} email={user.email} role={user.role} dateCreated={user.createdAt} />
      <LogoutButton />
    </Page>
  );
}
