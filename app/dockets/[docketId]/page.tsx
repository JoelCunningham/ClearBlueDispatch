import LinkButton from "@/components/buttons/link-button";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import LineItem from "@/components/wrappers/line-item";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDocket } from "@/features/dockets/queries";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DocketPageProps = {
  params: Promise<{ docketId: string }>;
};

export default async function DocketPage({ params }: DocketPageProps) {
  await requireRole("MANAGER");

  const { docketId } = await params;
  const docketIdNumber = idOrNotFound(docketId);
  const docket = valueOrNotFound(await getDocket(docketIdNumber));

  return (
    <Page>
      <Heading title={`Docket #${docket.id}`} backFallback="/dockets" actionLink={{ href: `/dockets/${docket.id}/edit`, text: "Edit" }} />
      <Card>
        <List>
          <LineItem name="Date" value={dateToLongFormat(docket.date)} vertical />
          <LineItem name="Customer" value={getCustomerName(docket.customerName, docket.address)} vertical />
          <LineItem name="Volume" value={`${docket.volume} L`} vertical />
          <LineItem name="Batch number" value={docket.batchNumber} vertical />
          <LineItem name="Representative" value={docket.repName} vertical />
          <LineItem name="Representative signature" value={docket.repSignature} vertical />
        </List>
      </Card>

      <LinkButton href={`/deliveries/${docket.deliveryId}`} text="View delivery details" />
    </Page>
  );
}
