import Link from "next/link";

import { UserFilter } from "@/features/routes/components/user-filter";
import { getRoutes, getUsers } from "@/features/routes/queries";
import { requireUser } from "@/lib/auth/require-user";

type RoutesPageProps = {
  searchParams: Promise<{ assignedUserId?: string; }>;
};

function getToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
  }).format(new Date());
}

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const assignedUserId = params.assignedUserId ? Number(params.assignedUserId) : undefined;

  const routes = await getRoutes({
    fromDate: getToday(),
    assignedUserId: user.role === "MANAGER" && Number.isInteger(assignedUserId) ? assignedUserId : undefined,
  });

  const users = user.role === "MANAGER" ? await getUsers() : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">
          Routes
        </h1>

        <p className="text-sm text-muted-foreground">
          {user.role === "MANAGER" ? "View upcoming delivery routes." : "Your upcoming delivery routes."}
        </p>
      </div>

      {user.role === "MANAGER" && (
        <div className="mb-6">
          <UserFilter users={users} selectedUserId={assignedUserId} />
        </div>
      )}

      {routes.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No upcoming routes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {new Date(`${route.date}T00:00:00`,).toLocaleDateString(
                      "en-AU",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      },
                    )}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {route.assignedUserName}
                  </p>
                </div>

                <span className="text-muted-foreground">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}