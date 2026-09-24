import DocketPdf from "@/content/docket-pdf";
import { getLogoBuffer } from "@/lib/utils/url-utils";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { db } from "@/prisma/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req: Request, { params }: { params: Promise<{ docketId: string }> }) {
  const { docketId } = await params;
  const docketIdNumber = Number(docketId);

  const docket = await db.orm.public.Docket.where({ id: docketIdNumber }).first();
  if (!docket) throw new Error(`Docket ${docketId} not found.`);

  const delivery = await db.orm.public.Delivery.where({ id: docket.deliveryId })
    .include("route")
    .include("location", location => location.include("customer"))
    .first();

  if (!delivery) throw new Error(`Delivery ${docket.deliveryId} not found.`);
  if (!delivery.route) throw new Error(`Route not found for delivery ${delivery.id}.`);
  if (!delivery.location) throw new Error(`Location not found for delivery ${delivery.id}.`);
  if (!delivery.location.customer) throw new Error(`Customer not found for location ${delivery.location.id}.`);

  const docketPdf = await renderToBuffer(
    DocketPdf({
      docketNumber: getDocketNumber(docket.id),
      date: delivery.route.date,
      customerName: delivery.location.customer.name,
      address: delivery.location.address,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      comments: docket.comments ?? undefined,
      repName: docket.repName,
      repSignature: docket.repSignature,
      logo: await getLogoBuffer()
    })
  );

  const { pdf } = await import("pdf-to-img");
  process.env.PDFJS_STANDARD_FONTS = path.join(process.cwd(), "node_modules/pdfjs-dist/standard_fonts/");

  const document = await pdf(docketPdf, { scale: 2 });
  const pageBuffer = await document.getPage(1);

  return new NextResponse(new Uint8Array(pageBuffer), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" }
  });
}
