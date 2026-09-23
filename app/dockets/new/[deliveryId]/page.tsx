import DocketForm from "@/components/forms/docket-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { getDelivery } from "@/features/deliveries/queries";
import { createDocket } from "@/features/dockets/actions";
import { CreateDocketInput } from "@/features/dockets/types";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongYearFormat } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type DocketPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function CreateDocketPage({ params }: DocketPageProps) {
  const { deliveryId } = await params;

  const deliveryIdNumber = idOrNotFound(deliveryId);
  const delivery = valueOrNotFound(await getDelivery(deliveryIdNumber));
  const customerName = getCustomerName(delivery.location.customerName, delivery.location.address);

  async function submitDocket(input: CreateDocketInput) {
    "use server";
    return await createDocket({ deliveryId: deliveryIdNumber, ...input });
  }

  return (
    <Page>
      <Heading title="Create docket" backFallback={`/deliveries/${deliveryIdNumber}`} />
      <DocketForm date={dateToLongYearFormat(delivery.date)} customerName={customerName} action={submitDocket} />
    </Page>
  );
}
