import Card from "@/components/wrappers/card";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { requireRole } from "@/lib/auth/authorization";

export default async function ManagePage() {
  await requireRole("MANAGER");

  return (
    <Page>
      <Heading title="Manage" subtitle="Manage customers, deliveries, and dockets." />
      <Card href="/manage/deliveries" title="Deliveries" subtitle="Create and manage deliveries." />
      <Card href="/manage/customers" title="Customers" subtitle="Create and manage customers." />
      <Card href="/manage/dockets" title="Dockets" subtitle="View and manage dockets." />
      <Card href="/manage/users" title="Users" subtitle="Manage app users and their roles." />
    </Page>
  );
}
