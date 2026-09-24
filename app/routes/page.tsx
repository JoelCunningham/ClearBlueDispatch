import RoutesForm from "@/components/forms/routes-from";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import { getRoutes, getUsers } from "@/features/routes/queries";
import { requireUser } from "@/lib/auth/authorization";
import { dateToLongFormat, dateToWeekFormat, getDayOfMonth, getToday, getWeekOfYear, isDatePast } from "@/lib/utils/date-utils";
import { idOrUndefined } from "@/lib/utils/validation-utils";

type RoutesPageProps = {
  searchParams: Promise<{
    assignedUserId?: string;
    includePast?: string;
  }>;
};

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const assignedUserId = idOrUndefined(params.assignedUserId);
  const includePast = params.includePast === "true";

  const users = user.role === "MANAGER" ? await getUsers() : [];
  const routes = await getRoutes({
    fromDate: includePast ? undefined : getToday(),
    assignedUserId: user.role === "MANAGER" && Number.isInteger(assignedUserId) ? assignedUserId : undefined
  });

  return (
    <Page>
      <Heading title={includePast ? "All Routes" : "Upcoming Routes"}>
        <RoutesForm role={user.role} users={users} />
      </Heading>
      <List emptyText="No routes found.">
        {routes.map((route, index) => {
          const previousWeek = getWeekOfYear(routes[index - 1]?.date);
          return (
            <div key={route.id}>
              {getWeekOfYear(route.date) !== previousWeek && <ListSeparator title={`Week ${dateToWeekFormat(route.date)}`} />}
              <Card
                href={`/routes/${route.id}`}
                title={dateToLongFormat(route.date)}
                subtitle={route.assignedUserName}
                avatar={getDayOfMonth(route.date)}
                colour={route.assignedUserDeleted && !isDatePast(route.date) ? "error" : "normal"}
              />
            </div>
          );
        })}
      </List>
    </Page>
  );
}
