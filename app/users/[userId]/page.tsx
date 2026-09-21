import { ProfileDetails } from "@/features/users/components/profile-details";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { getUser } from "@/features/users/queries";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type UserProfilePageProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;

  const userIdNumber = idOrNotFound(userId);
  const user = valueOrNotFound(await getUser(userIdNumber));

  return (
    <Page>
      <Heading
        title={user.name}
        subtitle="View this user's account details."
        actionLink={{ text: "Edit", href: `/users/${userIdNumber}/edit` }}
        backLink={{ text: "Users", href: "/users" }}
      />
      <ProfileDetails email={user.email} role={user.role} dateCreated={user.createdAt} />
    </Page>
  );
}
