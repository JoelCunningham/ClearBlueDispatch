export type CreateDeliveryInput = {
  assignedUserId: number;
  date: string;
  locationId: number;
  contactId?: number;
  notes: string;
  tankDetails: string;
};

export type DeliveryLocationOption = {
  id: number;
  address: string;
  suburb: string;
  customerId: number;
  customerName: string;
};

export type DeliveryContactOption = {
  id: number;
  name: string;
  phoneNumber: string;
  customerId: number;
};

export type DeliveryDetail = {
  id: number;
  position: number;
  notes: string;
  tankDetails: string;
  date: string;

  location: {
    address: string;
    customerName: string;
  };

  contact: {
    name: string;
    phoneNumber: string;
  } | null;

  docket: {
    id: number;
    volume: number;
    batchNumber: string;
    repName: string;
    repSignature: string;
  } | null;
};

export type DeliverySummary = {
  id: number;
  date: string;
  customerName: string;
  locationAddress: string;
  contactName: string | null;
  assignedUserName: string;
};
