export type CustomerFormInput = {
  name: string;
  rate: number;
  locations: {
    id?: number;
    address: string;
  }[];
  contacts: {
    id?: number;
    name: string;
    phoneNumber: string;
  }[];
  emails: {
    id?: number;
    emailAddress: string;
  }[];
};

export type CreateCustomerInput = CustomerFormInput;

export type UpdateCustomerInput = CustomerFormInput & { customerId: number };

export type CustomerSummary = {
  id: number;
  name: string;
  rate: number;
};

export type CustomerDetail = {
  id: number;
  name: string;
  rate: number;
  locations: {
    id: number;
    address: string;
  }[];
  contacts: {
    id: number;
    name: string;
    phoneNumber: string;
  }[];
  invoiceEmails: {
    id: number;
    emailAddress: string;
  }[];
};

export type LocationItem = {
  id?: number;
  address: string;
  clientId?: string;
};

export type ContactItem = {
  id?: number;
  name: string;
  phoneNumber: string;
  clientId?: string;
};

export type InvoiceEmailItem = {
  id?: number;
  emailAddress: string;
  clientId?: string;
};
