export type DocketFormInput = {
  volume: number;
  batchNumber: string;
  repName: string;
  repSignature: string;
};

export type CreateDocketInput = DocketFormInput;

export type UpdateDocketInput = DocketFormInput & { docketId: number };

export type DocketSummary = {
  id: number;
  date: string;
  customerName: string;
  address: string;
  volume: number;
};

export type DocketDetail = {
  id: number;
  deliveryId: number;
  date: string;
  customerName: string;
  address: string;
  volume: number;
  batchNumber: string;
  repName: string;
  repSignature: string;
};
