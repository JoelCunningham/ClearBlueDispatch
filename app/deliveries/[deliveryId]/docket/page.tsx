import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { getDelivery } from "@/features/deliveries/queries";
import { createDocket } from "@/features/dockets/actions";
import { DocketForm } from "@/components/forms/docket-form";
import { getFullName } from "@/lib/utils/customer-util";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DocketPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function CreateDocketPage({ params }: DocketPageProps) {
  const { deliveryId } = await params;

  const deliveryIdNumber = idOrNotFound(deliveryId);
  const delivery = valueOrNotFound(await getDelivery(deliveryIdNumber));
  const customerName = getFullName(delivery.location.customerName, delivery.location.address);

  async function submitDocket(formData: FormData) {
    "use server";

    const volume = formData.get("volume");
    const batchNumber = formData.get("batchNumber");
    const repName = formData.get("repName");
    const repSignature = formData.get("repSignature");

    await createDocket({
      deliveryId: deliveryIdNumber,
      volume: typeof volume === "string" ? Number(volume) : 0,
      batchNumber: typeof batchNumber === "string" ? batchNumber : "",
      repName: typeof repName === "string" ? repName : "",
      repSignature: typeof repSignature === "string" ? repSignature : ""
    });
  }

  return (
    <Page>
      <Heading title="Create docket" backLink={{ text: "delivery", href: `/deliveries/${deliveryIdNumber}` }} />
      <DocketForm docketNumber={delivery.id} date={delivery.date} customerName={customerName} action={submitDocket} />
    </Page>
  );
}
