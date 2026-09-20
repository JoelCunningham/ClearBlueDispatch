import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import ListSeparator from "@/components/wrappers/list-seperator";
import Page from "@/components/wrappers/page";
import { getDeliveries } from "@/features/deliveries/queries";
import { getFullName } from "@/lib/utils/customer-util";
import { dateToLongYearFormat } from "@/lib/utils/date-utils";

export default async function ManageDeliveriesPage() {
  const deliveries = await getDeliveries();

  return (
    <Page>
      <Heading
        title="Deliveries"
        subtitle="Manage deliveries and their docket information."
        backLink={{ text: "manage", href: "/manage" }}
        actionLink={{ text: "Create", href: "/manage/deliveries/new" }}
      />
      <List emptyText="No deliveries have been created yet.">
        {deliveries.map((delivery, index) => {
          const previousDate = deliveries[index - 1]?.date;
          return (
            <div key={delivery.id}>
              {delivery.date !== previousDate && <ListSeparator title={dateToLongYearFormat(delivery.date)} />}
              <Card
                title={getFullName(delivery.customerName, delivery.locationAddress)}
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
