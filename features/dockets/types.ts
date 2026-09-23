export type DocketFormInput = {
  volume: number;
  batchNumber: string;
  comments: string;
  repName: string;
  repSignature: Uint8Array;
};

export type CreateDocketInput = DocketFormInput;

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
};
