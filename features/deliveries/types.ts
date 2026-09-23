export type DeliveryFormInput = {
  assignedUserId: number;
  date: string;
  locationId: number;
  contactId?: number;
  notes: string;
  tankDetails: string;
};

export type CreateDeliveryInput = DeliveryFormInput;

export type UpdateDeliveryInput = DeliveryFormInput & { deliveryId: number };

export type DeliveryLocationOption = {
  id: number;
  address: string;
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
  date: Temporal.Instant;
  routeId: number;

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
  } | null;
};

export type DeliverySummary = {
  id: number;
  date: Temporal.Instant;
  customerName: string;
  locationAddress: string;
  contactName: string | null;
  assignedUserName: string;
};
