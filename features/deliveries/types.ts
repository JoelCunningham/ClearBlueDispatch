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
  location: {
    address: string;
    customerName: string;
  };
  contact: {
    name: string;
    phoneNumber: string;
  } | null;
};
