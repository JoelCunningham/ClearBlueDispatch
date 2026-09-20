import { Calendar, MapPin } from "lucide-react";

import PhoneButtons from "@/components/buttons/phone-buttons";
import LinkButton from "@/components/buttons/link-button";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import LineItem from "@/components/wrappers/line-item";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDelivery } from "@/features/deliveries/queries";
import { getFullName } from "@/lib/utils/customer-util";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { getGoogleMapsUrl } from "@/lib/utils/maps-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DeliveryPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { deliveryId } = await params;

  const deliveryIdNumber = idOrNotFound(deliveryId);
  const delivery = valueOrNotFound(await getDelivery(deliveryIdNumber));
  const contactSubtitle = delivery.contact ? `${delivery.contact.name} • ${delivery.contact.phoneNumber}` : "No contact.";

  return (
    <Page>
      <Heading
        title={getFullName(delivery.location.customerName, delivery.location.address)}
        subtitle={`${dateToLongFormat(delivery.date)} • Stop #${delivery.position}`}
        subtitleIcon={Calendar}
        backLink={{ text: "route", href: `/routes/${delivery.routeId}` }}
      />

      <LinkButton text={delivery.location.address} icon={MapPin} href={getGoogleMapsUrl(delivery.location.address)} />

      <Card title="Tank details" subtitle={delivery.tankDetails || "No tank details."} />
      <Card title="Notes" subtitle={delivery.notes || "No notes."} />
      <Card title="Contact" subtitle={contactSubtitle}>
        {delivery.contact && <PhoneButtons phoneNumber={delivery.contact.phoneNumber} />}
      </Card>

      {delivery.docket ? (
        <Card title="Docket" childrenPosition="bottom">
          <List>
            <LineItem name="Volume" value={delivery.docket.volume.toString()} />
            <LineItem name="Batch number" value={delivery.docket.batchNumber} />
            <LineItem name="Representative" value={delivery.docket.repName} />
            <LineItem name="Signature" value={delivery.docket.repSignature} />
          </List>
        </Card>
      ) : (
        <LinkButton text="Create docket" href={`/deliveries/${deliveryIdNumber}/docket`} />
      )}
    </Page>
  );
}
