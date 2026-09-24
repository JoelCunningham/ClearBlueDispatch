import { SearchBar } from "@/components/inputs/search-bar";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import { getDeliveries } from "@/features/deliveries/queries";
import { DeliverySummary } from "@/features/deliveries/types";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongYearFormat, isDatePast } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";

type DeliveriesPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function DeliveriesPage({ searchParams }: DeliveriesPageProps) {
  await requireRole("MANAGER");

  const { search } = await searchParams;
  const deliveries = await getDeliveries(search);

  const cardHasError = (delivery: DeliverySummary) => {
    if (isDatePast(delivery.date)) return false;

    if (delivery.assignedUserDeleted) return true;
    if (delivery.locationDeleted) return true;
    if (delivery.contactDeleted) return true;

    return false;
  };

  return (
    <Page>
      <Heading title="Deliveries" backFallback="/manage" actionLink={{ text: "Create", href: "/deliveries/new" }} />
      <SearchBar placeholder="Search deliveries..." />
      <List emptyText={search ? "No deliveries match your search." : "No deliveries have been created yet."}>
        {deliveries.map((delivery, index) => {
          const previousDate = deliveries[index - 1]?.date;
          return (
            <div key={delivery.id}>
              {(!previousDate || Temporal.Instant.compare(delivery.date, previousDate) !== 0) && (
                <ListSeparator title={dateToLongYearFormat(delivery.date)} />
              )}
              <Card
                title={getCustomerName(delivery.customerName, delivery.locationAddress)}
                subtitle={delivery.assignedUserName}
                href={`/deliveries/${delivery.id}`}
                colour={cardHasError(delivery) ? "error" : "normal"}
              />
            </div>
          );
        })}
      </List>
    </Page>
  );
}
