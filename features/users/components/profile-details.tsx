import Card from "@/components/wrappers/card";
import LineItem from "@/components/wrappers/line-item";
import List from "@/components/wrappers/list";
import { dateToLongYearFormat } from "@/lib/utils/date-utils";
import { capitalise } from "@/lib/utils/string-utils";
import { UserRole } from "@/types/next-auth";

type ProfileDetailsProps = {
  name?: string;
  email: string;
  role: UserRole;
  dateCreated: Temporal.Instant;
};

export function ProfileDetails({ name, email, role, dateCreated }: ProfileDetailsProps) {
  return (
    <Card>
      <List>
        {name && <LineItem name="Name" value={name} vertical />}
        <LineItem name="Role" value={capitalise(role)} vertical />
        <LineItem name="Email" value={email} vertical />
        <LineItem name="Password" value="************" vertical />
        <LineItem name="Date created" value={dateToLongYearFormat(dateCreated)} vertical />
      </List>
    </Card>
  );
}
