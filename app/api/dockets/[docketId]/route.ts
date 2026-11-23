import DocketPdf from "@/content/docket-pdf";
import { checkUser } from "@/lib/auth/authorization";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { getLogoBuffer } from "@/lib/utils/url-utils";
import { db } from "@/prisma/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { logError, logServerEvent } from "@/lib/utils/logger";

export async function GET(req: Request, { params }: { params: Promise<{ docketId: string }> }) {
  const startedAt = Date.now();
  try {
    const user = await checkUser();
    if (!user) {
      logServerEvent("warn", "api.docket_pdf_denied", { status: 401, reason: "authentication_required", durationMs: Date.now() - startedAt });
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { docketId } = await params;
    const docketIdNumber = Number(docketId);
    if (!Number.isSafeInteger(docketIdNumber) || docketIdNumber <= 0) {
      logServerEvent("warn", "api.docket_pdf_denied", { status: 404, reason: "invalid_docket_id", userId: user.id, durationMs: Date.now() - startedAt });
      return NextResponse.json({ error: "Docket not found." }, { status: 404 });
    }

    const docket = await db.orm.public.Docket.where({ id: docketIdNumber, deleted: false }).first();
    if (!docket) {
      logServerEvent("warn", "api.docket_pdf_denied", { status: 404, reason: "docket_not_found", docketId: docketIdNumber, userId: user.id, durationMs: Date.now() - startedAt });
      return NextResponse.json({ error: "Docket not found." }, { status: 404 });
    }

    const delivery = await db.orm.public.Delivery.where({ id: docket.deliveryId })
      .include("route")
      .include("location", location => location.include("customer"))
      .first();

    if (!delivery || !delivery.route || !delivery.location || !delivery.location.customer) {
      logServerEvent("error", "api.docket_pdf_failed", { status: 404, reason: "docket_data_incomplete", docketId: docketIdNumber, userId: user.id, durationMs: Date.now() - startedAt });
      return NextResponse.json({ error: "Docket not found." }, { status: 404 });
    }

    if (user.role !== "MANAGER" && delivery.route.assignedUserId.toString() !== user.id) {
      logServerEvent("warn", "api.docket_pdf_denied", { status: 403, reason: "route_access_denied", docketId: docketIdNumber, userId: user.id, durationMs: Date.now() - startedAt });
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

    logServerEvent("info", "api.docket_pdf_served", { status: 200, docketId: docketIdNumber, userId: user.id, pdfBytes: docketPdf.length, durationMs: Date.now() - startedAt });
    return new NextResponse(Buffer.from(docketPdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ClearBlue Solutions Docket ${getDocketNumber(docket.id)}.pdf"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch (error) {
    logError("api.docket_pdf_failed", error, { status: 500, durationMs: Date.now() - startedAt });
    return NextResponse.json({ error: "Unable to generate the docket." }, { status: 500 });
  }
}
