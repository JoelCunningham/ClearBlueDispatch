import LogoutButton from "@/components/buttons/logout-button";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { ProfileDetails } from "@/features/users/components/profile-details";
import { requireUser } from "@/lib/auth/authorization";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <Page>
      <Heading title="Profile" subtitle="Manage your account" actionLink={{ text: "Edit", href: "/profile/edit" }} />
      <ProfileDetails name={user.name} email={user.email} role={user.role} dateCreated={user.createdAt} />
      <LogoutButton />
    </Page>
  );
}
