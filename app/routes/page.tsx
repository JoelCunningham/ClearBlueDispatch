import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import UserFilter from "@/features/routes/components/user-filter";
import { getRoutes, getUsers } from "@/features/routes/queries";
import { requireUser } from "@/lib/auth/authorization";

import { dateToLongFormat, dateToWeekFormat, getToday } from "@/lib/utils/date-utils";
import { idOrUndefined } from "@/lib/utils/validation-utils";
import { getISOWeek } from "date-fns";

type RoutesPageProps = {
  searchParams: Promise<{ assignedUserId?: string }>;
};

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const assignedUserId = idOrUndefined(params.assignedUserId);
  const users = user.role === "MANAGER" ? await getUsers() : [];
  const routes = await getRoutes({
    fromDate: getToday(),
    assignedUserId: user.role === "MANAGER" && Number.isInteger(assignedUserId) ? assignedUserId : undefined
  });

  return (
    <Page>
      <Heading title="Upcoming Routes">{user.role === "MANAGER" && <UserFilter users={users} selectedUserId={assignedUserId} />}</Heading>
      <List emptyText="No upcoming routes.">
        {routes.map((route, index) => {
          const previousWeek = getISOWeek(routes[index - 1]?.date);
          return (
            <div key={route.id}>
              {getISOWeek(route.date) !== previousWeek && <ListSeparator title={`Week ${dateToWeekFormat(route.date)}`} />}
              <Card href={`/routes/${route.id}`} title={dateToLongFormat(route.date)} subtitle={route.assignedUserName} />
            </div>
          );
        })}
      </List>
    </Page>
  );
}
