import EmailButtons from "@/components/buttons/email-buttons";
import PhoneButtons from "@/components/buttons/phone-buttons";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getCustomer } from "@/features/customers/queries";
import { getGoogleMapsUrl } from "@/lib/utils/maps-utils";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function CustomerPage({ params }: PageProps) {
  const { customerId } = await params;

  const customerIdNumber = idOrNotFound(customerId);
  const customer = valueOrNotFound(await getCustomer(customerIdNumber));

  return (
    <Page>
      <Heading
        title={customer.name}
        subtitle={`$${customer.rate.toFixed(2)} per litre`}
        backLink={{ text: "customers", href: "/manage/customers" }}
        actionLink={{ text: "Edit", href: `/manage/customers/${customer.id}/edit` }}
      />
      <List title="Locations" emptyText="No locations.">
        {customer.locations.map(location => (
          <Card key={location.id} title={location.address} href={getGoogleMapsUrl(location.address)} />
        ))}
      </List>
      <List title="Contacts" emptyText="No contacts.">
        {customer.contacts.map(contact => (
          <Card key={contact.id} title={contact.name} subtitle={contact.phoneNumber}>
            {contact && <PhoneButtons phoneNumber={contact.phoneNumber} />}
          </Card>
        ))}
      </List>
      <List title="Invoice emails" emptyText="No invoice emails.">
        {customer.invoiceEmails.map(invoiceEmail => (
          <Card key={invoiceEmail.id} title={invoiceEmail.emailAddress}>
            {invoiceEmail && <EmailButtons emailAddress={invoiceEmail.emailAddress} />}
          </Card>
        ))}
      </List>
    </Page>
  );
}
