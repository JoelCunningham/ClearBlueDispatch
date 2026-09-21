import DocketForm from "@/components/forms/docket-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { updateDocket } from "@/features/dockets/actions";
import { getDocket } from "@/features/dockets/queries";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type EditDocketPageProps = {
  params: Promise<{
    docketId: string;
  }>;
};

export default async function EditDocketPage({ params }: EditDocketPageProps) {
  const { docketId } = await params;

  const docketIdNumber = idOrNotFound(docketId);
  const docket = valueOrNotFound(await getDocket(docketIdNumber));

  async function submitDocket(input: { volume: number; batchNumber: string; repName: string; repSignature: string }) {
    "use server";
    return updateDocket({ ...input, docketId: docket.id });
  }

  return (
    <Page>
      <Heading title={`Edit Docket #${docket.id}`} backLink={{ text: "docket", href: `/dockets/${docket.id}` }} />
      <DocketForm
        number={docket.id}
        date={docket.date}
        customerName={docket.customerName}
        volume={docket.volume}
        batchNumber={docket.batchNumber}
        repName={docket.repName}
        repSignature={docket.repSignature}
        action={submitDocket}
      />
    </Page>
  );
}
