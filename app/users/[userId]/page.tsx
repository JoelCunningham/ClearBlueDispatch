import ErrorAlert from "@/components/alerts/error-alert";
import PrimaryButton from "@/components/buttons/primary-button";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { restoreUser } from "@/features/users/actions";
import ProfileDetails from "@/features/users/components/profile-details";
import { getUser } from "@/features/users/queries";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type UserProfilePageProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;

  const userIdNumber = idOrNotFound(userId);
  const user = valueOrNotFound(await getUser(userIdNumber));

  async function restoreUserProfile() {
    "use server";
    if (!user) return { success: false, error: "User not found." };
    return restoreUser({ userId: user.id });
  }

  return (
    <Page>
      <Heading
        title={user.name}
        subtitle="View this user's account details."
        backFallback="/users"
        actionLink={user.deleted ? undefined : { text: "Edit", href: `/users/${userIdNumber}/edit` }}
      />
      {user.deleted && <ErrorAlert text="This user has been deleted and can no longer access the system or be edited." />}
      <ProfileDetails email={user.email} role={user.role} dateCreated={user.createdAt} />
      {user.deleted && <PrimaryButton text="Restore User" onClick={restoreUserProfile} />}
    </Page>
  );
}
