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

  invoiceEmails: {
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

export type LocationFormItem = {
  id?: number;
  address: string;
};

export type ContactFormItem = {
  id?: number;
  name: string;
  phoneNumber: string;
};

export type InvoiceEmailFormItem = {
  id?: number;
  emailAddress: string;
};
