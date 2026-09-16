import type { CustomerDetail } from "../types";

type CustomerSectionProps = {
  customer: Pick<CustomerDetail, "name" | "rate">;
};

export function CustomerSection({ customer }: CustomerSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Customer details</h2>

      <div className="rounded-lg border p-4">
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="text-sm font-medium">{customer.name}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Delivery rate</dt>
            <dd className="text-sm font-medium">${customer.rate.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
