import DocketPdf from "@/content/docket-pdf";
import { getLogoBuffer } from "@/lib/utils/url-utils";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { getAuthenticatedUser } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req: Request, { params }: { params: Promise<{ docketId: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { docketId } = await params;
  const docketIdNumber = Number(docketId);
  if (!Number.isSafeInteger(docketIdNumber) || docketIdNumber <= 0) {
    return NextResponse.json({ error: "Docket not found." }, { status: 404 });
  }

  const docket = await db.orm.public.Docket.where({ id: docketIdNumber, deleted: false }).first();
  if (!docket) return NextResponse.json({ error: "Docket not found." }, { status: 404 });

  const delivery = await db.orm.public.Delivery.where({ id: docket.deliveryId })
    .include("route")
    .include("location", location => location.include("customer"))
    .first();

  if (!delivery || !delivery.route || !delivery.location || !delivery.location.customer) {
    return NextResponse.json({ error: "Docket not found." }, { status: 404 });
  }

  if (user.role !== "MANAGER" && delivery.route.assignedUserId.toString() !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

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
    headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" }
  });
}
