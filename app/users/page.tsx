import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { UserList } from "@/features/users/components/user-list";
import { getUsers } from "@/features/users/queries";

export default async function ManageUsersPage() {
  const users = await getUsers();

  const listUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toString(),
    deleted: user.deleted
  }));

  return (
    <Page>
      <Heading title="Users" backFallback="/manage" actionLink={{ text: "Create", href: "/users/new" }} />
      <UserList users={listUsers} />
    </Page>
  );
}
