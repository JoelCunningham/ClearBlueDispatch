import Image from "next/image";

import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { idOrNotFound } from "@/lib/utils/validation-utils";

interface DocketPdfPageProps {
  params: Promise<{ docketId: string }>;
}

export default async function DocketPdfPage({ params }: DocketPdfPageProps) {
  const { docketId } = await params;
  const docketIdNumber = idOrNotFound(docketId);

  return (
    <Page>
      <Heading title={`Docket ${getDocketNumber(docketIdNumber)} PDF`} backFallback={`/dockets/${docketIdNumber}`} />
      <Image
        src={`/api/dockets/${docketIdNumber}`}
        alt={`Docket #${docketIdNumber} Preview`}
        width={400}
        height={600}
        className="max-w-full h-auto shadow-md rounded border bg-background"
        loading="eager"
      />
    </Page>
  );
}
