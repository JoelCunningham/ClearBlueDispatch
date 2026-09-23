import Image from "next/image";

import LinkButton from "@/components/buttons/link-button";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import LineItem from "@/components/wrappers/line-item";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDocket } from "@/features/dockets/queries";
import { bufferToDataUrl } from "@/lib/utils/buffer-utils";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { getCustomerName, getDocketNumber } from "@/lib/utils/string-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DocketPageProps = {
  params: Promise<{ docketId: string }>;
};

export default async function DocketPage({ params }: DocketPageProps) {
  const { docketId } = await params;
  const docketIdNumber = idOrNotFound(docketId);
  const docket = valueOrNotFound(await getDocket(docketIdNumber));

  return (
    <Page>
      <Heading
        title={`Docket ${getDocketNumber(docket.id)}`}
        backFallback="/dockets"
        actionLink={{ href: `/dockets/${docket.id}/edit`, text: "Edit" }}
      />
      <Card>
        <List>
          <LineItem name="Date" value={dateToLongFormat(docket.date)} vertical />
          <LineItem name="Customer" value={getCustomerName(docket.customerName, docket.address)} vertical />
          <LineItem name="Volume" value={`${docket.volume} L`} vertical />
          <LineItem name="Batch number" value={docket.batchNumber} vertical />
          <LineItem name="Representative" value={docket.repName} vertical />
          <LineItem name="Representative signature" vertical>
            <Image
              height={10}
              width={200}
              src={bufferToDataUrl(docket.repSignature)}
              alt="Representative signature"
              className="w-auto h-auto"
            />
          </LineItem>
        </List>
      </Card>
      <LinkButton href={`/dockets/${docket.id}/pdf`} text="View PDF" />
      <LinkButton href={`/deliveries/${docket.deliveryId}`} text="Go to delivery details" />
    </Page>
  );
}
