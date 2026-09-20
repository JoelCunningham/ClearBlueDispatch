import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { requireUser } from "@/lib/auth/require-user";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <Page>
      <Heading title="Profile" />

      <p className="mt-4">Signed in as {user.name ?? user.email}</p>
      <p className="text-sm text-muted-foreground">Role: {user.role}</p>
    </Page>
  );
}
