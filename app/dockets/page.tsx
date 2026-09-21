import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDockets } from "@/features/dockets/queries";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";

export default async function ManageDocketsPage() {
  await requireRole("MANAGER");

  const dockets = await getDockets();

  return (
    <Page>
      <Heading title="Dockets" subtitle="View and manage delivery dockets." />

      <List emptyText="No dockets have been created yet.">
        {dockets.map(docket => (
          <Card
            key={docket.id}
            href={`/dockets/${docket.id}`}
            title={getCustomerName(docket.customerName, docket.address)}
            subtitle={`${dateToLongFormat(docket.date)} • ${docket.volume} L`}
          />
        ))}
      </List>
    </Page>
  );
}
