import { SearchBar } from "@/components/inputs/search-bar";
import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import List from "@/components/wrappers/list";
import Page from "@/components/wrappers/page";
import { getDockets } from "@/features/dockets/queries";
import { requireRole } from "@/lib/auth/authorization";
import { dateToLongFormat } from "@/lib/utils/date-utils";
import { getCustomerName } from "@/lib/utils/string-utils";

type DocketsPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function DocketsPage({ searchParams }: DocketsPageProps) {
  await requireRole("MANAGER");

  const { search } = await searchParams;
  const dockets = await getDockets(search);

  return (
    <Page>
      <Heading title="Dockets" backFallback="/manage" subtitle="View and manage delivery dockets." />
      <SearchBar placeholder="Search dockets..." />
      <List emptyText={search ? "No dockets match your search." : "No dockets have been created yet."}>
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
