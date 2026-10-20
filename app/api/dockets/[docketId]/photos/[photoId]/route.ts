import { NextResponse } from "next/server";

import { requireDocketAccess } from "@/lib/auth/authorization";
import { getPrivatePhotoUrl } from "@/lib/utils/docket-photo-utils";
import { db } from "@/prisma/db";

export async function GET(_: Request, { params }: { params: Promise<{ docketId: string; photoId: string }> }) {
  const { docketId, photoId } = await params;
  const docketIdNumber = Number(docketId);
  const photoIdNumber = Number(photoId);

  if (!Number.isSafeInteger(docketIdNumber) || docketIdNumber <= 0 || !Number.isSafeInteger(photoIdNumber) || photoIdNumber <= 0) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const docket = await requireDocketAccess(docketIdNumber);
  if (!docket) return NextResponse.json({ error: "Docket not found." }, { status: 404 });

  const photo = await db.orm.public.DocketPhoto.where({
    id: photoIdNumber,
    docketId: docketIdNumber,
    deleted: false
  }).first();
  if (!photo) return NextResponse.json({ error: "Photo not found." }, { status: 404 });

  return NextResponse.json({ url: await getPrivatePhotoUrl(photo.blobId) });
}
