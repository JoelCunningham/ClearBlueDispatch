import Link from "next/link";
import { notFound } from "next/navigation";

import { DeliveryList } from "@/features/routes/components/delivery-list";
import { getRoute } from "@/features/routes/queries";

type RoutePageProps = {
  params: Promise<{ routeId: string }>;
};

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;
  const id = Number(routeId);

  if (!Number.isInteger(id)) notFound();
  const route = await getRoute(id);
  if (!route) notFound();

  const formattedDate = new Date(`${route.date}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href="/routes" className="text-sm text-muted-foreground hover:text-foreground">
          ← Routes
        </Link>

        <h1 className="text-2xl font-semibold">{formattedDate}</h1>

        <p className="text-sm text-muted-foreground">Assigned to {route.assignedUserName}</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Deliveries</h2>

          <span className="text-sm text-muted-foreground">
            {route.deliveries.length} {route.deliveries.length === 1 ? "delivery" : "deliveries"}
          </span>
        </div>

        {route.deliveries.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-sm text-muted-foreground">No deliveries assigned to this route.</p>
          </div>
        ) : (
          <DeliveryList routeId={route.id} deliveries={route.deliveries} />
        )}
      </section>
    </main>
  );
}
