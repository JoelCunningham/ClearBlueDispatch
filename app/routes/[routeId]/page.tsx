import { User } from "lucide-react";

import Heading from "@/components/wrappers/heading";
import InfoAlert from "@/components/alerts/info-alert";
import Page from "@/components/wrappers/page";
import DeliveryList from "@/features/routes/components/delivery-list";
import { getRoute } from "@/features/routes/queries";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type RoutePageProps = {
  params: Promise<{ routeId: string }>;
};

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;

  const id = idOrNotFound(routeId);
  const route = valueOrNotFound(await getRoute(id));
  const title = dateToLongFormat(route.date);

  return (
    <Page>
      <Heading
        title={title}
        subtitle={route.assignedUserName}
        subtitleIcon={User}
        backLink={{ text: "routes", href: "/routes" }}
      />
      {route.deliveries.length === 0 ? (
        <InfoAlert text="No deliveries for this route." />
      ) : (
        <DeliveryList routeId={route.id} deliveries={route.deliveries} />
      )}
    </Page>
  );
}
