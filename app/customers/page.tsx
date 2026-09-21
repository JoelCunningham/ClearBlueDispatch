import { SearchBar } from "@/components/inputs/search-bar";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import { getCustomers } from "@/features/customers/queries";
import { requireRole } from "@/lib/auth/authorization";
import { getFirstLetter } from "@/lib/utils/string-utils";

interface CustomersPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  requireRole("MANAGER");

  const { search } = await searchParams;
  const customers = await getCustomers(search);

  return (
    <Page>
      <Heading
        title="Manage Customers"
        backLink={{ text: "manage", href: "/manage" }}
        actionLink={{ text: "Create", href: "/customers/new" }}
      />
      <SearchBar placeholder="Search customers..." />
      <List emptyText={search ? "No customers match your search." : "No customers have been created yet."}>
        {customers.map(customer => {
          const previousLetter = getFirstLetter(customers[customers.indexOf(customer) - 1]?.name);
          return (
            <div key={customer.id}>
              {previousLetter !== getFirstLetter(customer.name) && <ListSeparator title={getFirstLetter(customer.name)} />}
              <Card
                key={customer.id}
                title={customer.name}
                subtitle={`$${customer.rate.toFixed(2)} per litre`}
                href={`/customers/${customer.id}`}
              />
            </div>
          );
        })}
      </List>
    </Page>
  );
}
