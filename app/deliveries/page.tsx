import { SearchBar } from "@/components/inputs/search-bar";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import { getDeliveries } from "@/features/deliveries/queries";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongYearFormat } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";

type DeliveriesPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function DeliveriesPage({ searchParams }: DeliveriesPageProps) {
  await requireRole("MANAGER");

  const { search } = await searchParams;
  const deliveries = await getDeliveries(search);

  return (
    <Page>
      <Heading title="Deliveries" backLink={{ text: "manage", href: "/manage" }} actionLink={{ text: "Create", href: "/deliveries/new" }} />
      <SearchBar placeholder="Search deliveries..." />
      <List emptyText={search ? "No deliveries match your search." : "No deliveries have been created yet."}>
        {deliveries.map((delivery, index) => {
          const previousDate = deliveries[index - 1]?.date;
          return (
            <div key={delivery.id}>
              {delivery.date !== previousDate && <ListSeparator title={dateToLongYearFormat(delivery.date)} />}
              <Card
                title={getCustomerName(delivery.customerName, delivery.locationAddress)}
                subtitle={delivery.assignedUserName}
                href={`/deliveries/${delivery.id}`}
              />
            </div>
          );
        })}
      </List>
    </Page>
  );
}
