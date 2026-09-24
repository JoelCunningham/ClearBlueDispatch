import { Calendar, MapPin } from "lucide-react";

import ErrorMessage from "@/components/alerts/error-message";
import LinkButton from "@/components/buttons/link-button";
import PhoneButtons from "@/components/buttons/phone-buttons";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import LineItem from "@/components/wrappers/line-item";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDelivery } from "@/features/deliveries/queries";
import { dateToLongFormat, isDatePast } from "@/lib/utils/date-utils";
import { getGoogleMapsUrl } from "@/lib/utils/maps-utils";
import { getCustomerName } from "@/lib/utils/string-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DeliveryPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { deliveryId } = await params;

  const deliveryIdNumber = idOrNotFound(deliveryId);
  const delivery = valueOrNotFound(await getDelivery(deliveryIdNumber));
  const contactSubtitle = delivery.contact ? `${delivery.contact.name} • ${delivery.contact.phoneNumber}` : "No contact.";

  const isPastDelivery = isDatePast(delivery.date);

  return (
    <Page>
      <Heading
        title={getCustomerName(delivery.customer.name, delivery.location.address)}
        subtitle={`${dateToLongFormat(delivery.date)} • Stop #${delivery.position}`}
        subtitleIcon={Calendar}
        backFallback={`/routes/${delivery.routeId}`}
        actionLink={{ text: "Edit", href: `/deliveries/${deliveryIdNumber}/edit`, role: "MANAGER" }}
      />

      <ErrorMessage assigned="delivery" assignee="user" deleted={delivery.user.deleted} past={isPastDelivery} />
      <ErrorMessage assigned="delivery" assignee="location" deleted={delivery.location.deleted} past={isPastDelivery} />
      <ErrorMessage assigned="delivery" assignee="contact" deleted={delivery.contact?.deleted ?? false} past={isPastDelivery} />
      <ErrorMessage assigned="delivery" assignee="customer" deleted={delivery.customer.deleted} past={isPastDelivery} />

      <LinkButton text={delivery.location.address} icon={MapPin} href={getGoogleMapsUrl(delivery.location.address)} />

      <Card title="Tank details" subtitle={delivery.tankDetails || "No tank details."} />
      <Card title="Notes" subtitle={delivery.notes || "No notes."} />
      <Card title="Contact" subtitle={contactSubtitle}>
        {delivery.contact && <PhoneButtons phoneNumber={delivery.contact.phoneNumber} />}
      </Card>

      {delivery.docket ? (
        <Card title="Docket" childrenPosition="bottom" href={`/dockets/${delivery.docket.id}`}>
          <List>
            <LineItem name="Volume" value={delivery.docket.volume.toString()} />
            <LineItem name="Batch number" value={delivery.docket.batchNumber} />
            <LineItem name="Representative" value={delivery.docket.repName} />
          </List>
        </Card>
      ) : (
        <LinkButton text="Create docket" href={`/dockets/new/${deliveryIdNumber}`} />
      )}
      <LinkButton href={`/customers/${delivery.customer.id}`} text="Go to customer details" />
    </Page>
  );
}
