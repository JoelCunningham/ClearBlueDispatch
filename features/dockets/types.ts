export type DocketFormInput = {
  volume: number;
  batchNumber: string;
  comments: string;
  repName: string;
  repSignature: string;
  photos: UploadedPhoto[];
};

export type UploadedPhoto = {
  blobId: string;
  contentType: string;
  size: number;
};

export type DocketPhotoPreview = UploadedPhoto & {
  id: number;
  previewUrl: string;
};

export type DocketPhotoReference = UploadedPhoto & {
  id: number;
};

export type CreateDocketInput = DocketFormInput & { deliveryId: number };

export type UpdateDocketInput = DocketFormInput & { docketId: number };

export type DocketSummary = {
  id: number;
  date: Temporal.Instant;
  customerName: string;
  address: string;
  volume: number;
};

export type DocketDetail = {
  id: number;
  deliveryId: number;
  date: Temporal.Instant;
  customerName: string;
  address: string;
  volume: number;
  batchNumber: string;
  comments?: string;
  repName: string;
  repSignature: Uint8Array;
  photos: DocketPhotoReference[];
};
