import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { requireRole } from "@/lib/auth/authorization";
import { ScrollText, Store, Truck, UserRound } from "lucide-react";

export default async function ManagePage() {
  await requireRole("MANAGER");

  return (
    <Page>
      <Heading title="Manage" subtitle="Manage customers, deliveries, and dockets." />
      <Card href="/deliveries" title="Deliveries" subtitle="Create and manage deliveries." avatar={<Truck />} />
      <Card href="/customers" title="Customers" subtitle="Create and manage customers." avatar={<Store />} />
      <Card href="/dockets" title="Dockets" subtitle="View and manage dockets." avatar={<ScrollText />} />
      <Card href="/users" title="Users" subtitle="Manage app users and their roles." avatar={<UserRound />} />
    </Page>
  );
}
