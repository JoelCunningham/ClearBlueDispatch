import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getUsers } from "@/features/users/queries";
import { capitalise } from "@/lib/utils/string-utils";

export default async function ManageUsersPage() {
  const users = await getUsers();

  return (
    <Page>
      <Heading title="Users" />
      <List emptyText="No users have been created yet.">
        {users.map(user => (
          <Card key={user.id} title={user.name} subtitle={capitalise(user.role)} href={`/users/${user.id}`} />
        ))}
      </List>
    </Page>
  );
}
