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

export type LocationSummary = {
  id: number;
  address: string;
};

export type ContactSummary = {
  id: number;
  name: string;
  phoneNumber: string;
};

export type InvoiceEmailSummary = {
  id: number;
  emailAddress: string;
};

export type CustomerDetail = {
  id: number;
  name: string;
  rate: number;
  locations: LocationSummary[];
  contacts: ContactSummary[];
  invoiceEmails: InvoiceEmailSummary[];
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
