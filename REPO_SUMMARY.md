# Clear Blue Dispatch: Repository Summary

This document is a code-aware handoff for working on the repository without opening every source file. It describes the current implementation as of 2026-09-16. Treat the source code as authoritative if this document and the code diverge.

## Product

Clear Blue Dispatch is a mobile-oriented delivery and docket management application for Clear Blue Solutions. It has two user roles:

- `DRIVER`: views assigned upcoming routes and delivery details, including navigation and contact actions; can reorder deliveries on routes they own.
- `MANAGER`: can view all upcoming routes, filter by driver, create deliveries, and create customers.

The home page redirects to `/routes`. The root layout always renders bottom navigation for Routes, Manage, and Profile.

## Technology

- Next.js `16.3.5`, App Router, React `19.2.8`, TypeScript strict mode.
- NextAuth `5.0.0-beta.32` with JWT sessions and a credentials provider.
- PostgreSQL through `@prisma/orm-postgres` `8.0.0-rc.11` and Prisma `8.0.0-rc.15` contract-based ORM APIs.
- Tailwind CSS v4, shadcn/base-nova setup, CSS variables, Lucide icons.
- `bcryptjs` for password hashes.
- Server Actions for mutations; Zod schemas for customer and delivery input validation.
- Australian locale/time assumptions: route “today” is calculated in `Australia/Melbourne`; dates display with `en-AU`.

## Run and configure

Required environment variables, shown in `.env.example`:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/clear_blue_dispatch
AUTH_SECRET=<auth_secret>
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Useful commands:

```bash
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm run contract:emit
npx tsx scripts/create-user.ts <email> <name> <password> [DRIVER|MANAGER]
```

Database setup requires a reachable PostgreSQL database and the repository's Prisma ORM migration/contract workflow. The initial migration is under `migrations/app/20260915T1159_initial_schema/`; generated runtime contract files are under `prisma/contract.*` and the migration snapshot directory. There is no seed script.

## Data model

The schema is in `prisma/contract.prisma`.

- `User`: unique email, name, `role` (`DRIVER` or `MANAGER`), bcrypt `passwordHash`, timestamps.
- `Route`: assigned user plus a calendar date. `(assignedUserId, date)` is unique. Has many deliveries.
- `Delivery`: belongs to a route and location; may have a contact and one docket; stores integer `position`, `notes`, and `tankDetails`.
- `Docket`: one-to-one with a delivery; stores volume, batch number, representative name, and representative signature.
- `Customer`: name and delivery rate; owns locations, contacts, and invoice email records.
- `Location`: customer-owned address; can be used by many deliveries.
- `Contact`: customer-owned name and phone number; can be attached to many deliveries.
- `InvoiceEmail`: customer-owned email address.

Foreign-key/index behaviour is represented in the generated migration. The route uniqueness constraint prevents duplicate routes for the same driver/date. Delivery position is application-managed and is not database-unique.

## Authentication and authorization

`auth.ts` configures NextAuth with a credentials provider. Login looks up the email in the database, compares the supplied password with `passwordHash` using bcrypt, and places the user id and role in the JWT and session. The sign-in page is `/login`; invalid credentials return an error query parameter.

Authorization helpers:

- `requireUser()` calls `auth()` and redirects unauthenticated users to `/login`.
- `requireRole(role)` redirects a signed-in user to `/routes` if their role does not match.
- `requireRouteAccess(routeId)` loads the route and permits managers or the assigned user; unauthorized users are redirected to `/routes`.

`proxy.ts` protects paths beginning with `/routes`, `/manage`, or `/profile` before the page runs. The API route `/api/auth/[...nextauth]` exposes NextAuth GET/POST handlers. Server-side queries/actions repeat authorization checks, so protection is not only client/navigation-based.

## User-facing routes

### Shared

- `/`: redirects to `/routes`.
- `/login`: email/password login, supports a `callbackUrl`.
- `/profile`: shows the signed-in user name/email and role.
- `/routes`: upcoming routes from today onward. Drivers see their own routes; managers see all routes and can filter by assigned user.
- `/routes/[routeId]`: authorized route detail, assigned driver/date, deliveries sorted by position.
- `/routes/[routeId]/deliveries/[deliveryId]`: authorized delivery detail with customer, address, Google Maps link, tank details, notes, and optional call/text contact actions.

### Manager-only

- `/manage`: links to delivery and customer management.
- `/manage/deliveries`: create a delivery by date, driver, location, optional/required-as-available customer contact, tank details, and notes.
- `/manage/customers`: list customers and rates, with a create link.
- `/manage/customers/new`: create a customer name and nonnegative delivery rate.
- `/manage/customers/[customerId]`: currently exists but is empty, so the customer link leads to a blank page.

The bottom navigation currently renders Manage for every signed-in user, but the page itself redirects drivers away via `requireRole("MANAGER")`.

## Main workflows

### Create customer

The manager-only server action validates trimmed name and nonnegative numeric rate, creates the customer, revalidates `/manage/customers` and `/manage`, then redirects to `/manage/customers/[id]`. The page contains leftover success handling after calling the action, but the action redirects on success before that code can run.

### Create delivery

The manager-only action validates date, positive ids, and trimmed text fields. It verifies the location, verifies that a selected contact exists and belongs to the location's customer, finds or creates the unique driver/date route, appends the delivery at `existingDeliveries.length + 1`, and revalidates route/manage paths. The form filters contacts client-side based on the selected location's customer.

### View and reorder routes

Route queries require a user. Drivers are filtered to `assignedUserId === session.user.id`; managers can optionally filter by driver. Route and delivery details use `requireRouteAccess`. The client delivery list optimistically moves an item up/down and calls `reorderDeliveries`.

Reordering validates that the submitted ids are exactly the route's existing delivery ids, then uses a transaction to assign temporary negative positions followed by final `1..n` positions. This avoids collisions during updates.

## Code examples

The examples below use the repository's current conventions. They are intentionally small enough to copy into a new feature and adapt.

### Database access

The database singleton is typed from the generated contract and reads `DATABASE_URL`:

```ts
import { db } from "@/prisma/db";

const users = await db.orm.public.User.orderBy(user => user.name.asc()).all();

const route = await db.orm.public.Route.where({ id: routeId }).include("assignedUser").include("deliveries").first();

const customer = await db.orm.public.Customer.create({
  name: "Example Customer",
  rate: 125
});
```

Use the contract API through `db.orm.public.<Model>`. Do not introduce `@prisma/client` imports or assume classic Prisma Client methods. Common query methods already used are `where`, `first`, `all`, `include`, `orderBy`, `create`, and `update`.

For multi-step writes, use the transaction callback so all operations share the transaction client:

```ts
const result = await db.transaction(async tx => {
  const route = await tx.orm.public.Route.first({
    assignedUserId,
    date
  });

  const savedRoute =
    route ??
    (await tx.orm.public.Route.create({
      assignedUserId,
      date
    }));

  const delivery = await tx.orm.public.Delivery.create({
    routeId: savedRoute.id,
    locationId,
    contactId,
    position: 1,
    notes,
    tankDetails
  });

  return { routeId: savedRoute.id, deliveryId: delivery.id };
});
```

### Protected server page

Require authentication at the start of a page or query. The helper redirects to `/login` when there is no session:

```tsx
import { requireUser } from "@/lib/auth/require-user";

export default async function RoutesPage() {
  const user = await requireUser();

  return <p>Signed in as {user.name ?? user.email}</p>;
}
```

For manager-only pages and queries:

```tsx
import { requireRole } from "@/lib/auth/require-role";

export default async function ManagePage() {
  const manager = await requireRole("MANAGER");

  return <h1>Manage dispatch data for {manager.name}</h1>;
}
```

For route-owned resources, call `requireRouteAccess(routeId)`. It returns `null` when the route does not exist, permits managers or the assigned driver, and redirects unauthorized users:

```ts
const route = await requireRouteAccess(routeId);
if (!route) return null;
```

### Role-aware query

Queries enforce visibility in the database query rather than filtering only in JSX:

```ts
export async function getRoutes(options: { fromDate: string; assignedUserId?: number }) {
  const user = await requireUser();

  let query = db.orm.public.Route.where(route => route.date.gte(options.fromDate))
    .include("assignedUser")
    .orderBy(route => route.date.asc());

  if (user.role === "DRIVER") {
    query = query.where({ assignedUserId: Number(user.id) });
  } else if (options.assignedUserId !== undefined) {
    query = query.where({ assignedUserId: options.assignedUserId });
  }

  const routes = await query.all();
  return routes.map(route => ({
    id: route.id,
    assignedUserId: route.assignedUserId,
    assignedUserName: route.assignedUser.name,
    date: route.date
  }));
}
```

The session id is a string because it comes from NextAuth, while database user ids are numbers. Existing code converts with `Number(user.id)` when querying.

### Validated server action

Mutations are server-only, authorize before writing, validate with Zod, write through `db`, then revalidate affected paths:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/prisma/db";
import { createCustomerSchema } from "./validation";

export async function createCustomer(input: unknown) {
  await requireRole("MANAGER");

  const result = createCustomerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid customer details." };
  }

  const customer = await db.orm.public.Customer.create(result.data);

  revalidatePath("/manage/customers");
  revalidatePath("/manage");

  return { success: true, customerId: customer.id };
}
```

The current customer action redirects after creation instead of returning `customerId`; follow the existing behaviour when extending that workflow:

```ts
revalidatePath("/manage/customers");
redirect(`/manage/customers/${customer.id}`);
```

### Zod validation and types

Validation lives beside the feature action. Form values arrive as strings, so numeric fields use `z.coerce.number()`:

```ts
import { z } from "zod";

export const createDeliverySchema = z.object({
  assignedUserId: z.coerce.number().int().positive(),
  date: z.iso.date(),
  locationId: z.coerce.number().int().positive(),
  contactId: z.coerce.number().int().positive().optional(),
  notes: z.string().trim(),
  tankDetails: z.string().trim()
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;
```

Server-side validation is still required even when the HTML form uses `required`, `min`, or `type="date"`. A browser can bypass those controls and server actions are callable independently of the page UI.

### Server action passed to a form

The page converts `FormData` into the feature input and passes a server action to a client form component:

```tsx
import { createDelivery } from "@/features/deliveries/actions";

async function submitDelivery(formData: FormData) {
  "use server";

  const assignedUserId = formData.get("assignedUserId");
  const date = formData.get("date");
  const locationId = formData.get("locationId");

  await createDelivery({
    assignedUserId: typeof assignedUserId === "string" ? Number(assignedUserId) : 0,
    date: typeof date === "string" ? date : "",
    locationId: typeof locationId === "string" ? Number(locationId) : 0,
    notes: String(formData.get("notes") ?? ""),
    tankDetails: String(formData.get("tankDetails") ?? "")
  });
}
```

The receiving client component uses the action as the form action:

```tsx
type FormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function CreateForm({ action }: FormProps) {
  return (
    <form action={action}>
      <input name="date" type="date" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Route and delivery page params

Next.js page params are promises in this project. Convert ids and use `notFound()` before querying:

```tsx
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ routeId: string; deliveryId: string }>;
};

export default async function DeliveryPage({ params }: PageProps) {
  const { routeId, deliveryId } = await params;
  const routeIdNumber = Number(routeId);
  const deliveryIdNumber = Number(deliveryId);

  if (!Number.isInteger(routeIdNumber) || !Number.isInteger(deliveryIdNumber)) {
    notFound();
  }

  const delivery = await getDelivery(routeIdNumber, deliveryIdNumber);
  if (!delivery) notFound();

  return <h1>{delivery.location.customerName}</h1>;
}
```

`getDelivery(routeId, deliveryId)` checks route access and queries with both ids, so a delivery from another route cannot be loaded by changing only the URL.

### Optimistic reorder action

The existing client list updates immediately, then rolls back if the server rejects the id list:

```tsx
const previousDeliveries = deliveries;
const nextDeliveries = [...deliveries];
const [delivery] = nextDeliveries.splice(index, 1);
nextDeliveries.splice(index + direction, 0, delivery);

nextDeliveries.forEach((item, itemIndex) => {
  item.position = itemIndex + 1;
});

setDeliveries(nextDeliveries);

startTransition(async () => {
  const result = await reorderDeliveries(
    routeId,
    nextDeliveries.map(item => item.id)
  );

  if (!result.success) setDeliveries(previousDeliveries);
});
```

When adding similar mutations, keep the pending guard so users cannot submit overlapping reorder requests. Server-side actions must still validate ownership and the complete id set.

### New feature recipe

For a new domain such as dockets or customer contacts:

1. Add or update the model in `prisma/contract.prisma`.
2. Emit/apply the Prisma contract migration and confirm `prisma/contract.d.ts` and `contract.json` are current.
3. Create `features/<domain>/types.ts`, `validation.ts`, `queries.ts`, and `actions.ts`.
4. Put interactive controls in `features/<domain>/components/`; keep data fetching and authorization in server pages/queries.
5. Call `requireRole` or `requireRouteAccess` inside every query/action that exposes or mutates protected data.
6. Revalidate the list/detail paths affected by each mutation.
7. Add a route under `app/`, then run `npx tsc --noEmit`, `npm run lint`, and the relevant manual workflow.

## Source map

- `app/`: route entry points, login, profile, manager pages, manifest, auth API route, global styles, root layout.
- `features/routes/`: route queries, delivery reorder action, route list/filter/reorder components, route types.
- `features/deliveries/`: delivery creation action, authorized delivery query, validation/types, create form.
- `features/customers/`: customer creation action, list query, validation/types, create form.
- `lib/auth/`: reusable authentication, role, and route-access guards.
- `prisma/`: contract schema, generated contract types/JSON, runtime database singleton, Prisma 8 notes.
- `migrations/`: generated initial PostgreSQL migration and contract snapshot.
- `scripts/create-user.ts`: command-line user creation with bcrypt hashing.
- `components/navigation/`: client bottom navigation.
- `components/ui/button.tsx`: generated shadcn/base-ui button primitive, currently not used by the hand-written forms/pages.
- `types/next-auth.d.ts`: session/JWT type augmentation for id and role.
- `proxy.ts`: pathname-level auth redirect.

## Current gaps and risks

- Customer detail page is empty; there is no UI or query/action for editing customer locations, contacts, invoice emails, or rates.
- No delivery edit/delete flow, route creation/editing UI, docket entry/generation, signature capture, photo/media storage, invoicing, or document export exists yet.
- No service worker, offline behaviour, install UX beyond the manifest, network-failure UX, or PWA caching is implemented.
- No automated unit, integration, or Playwright tests are present in the visible repository.
- No seed/development data script exists; users must be created manually with `scripts/create-user.ts`.
- `zod` is imported by validation modules but is not declared directly in `package.json`; it is present in the installed lockfile dependency graph. Add it as a direct dependency if clean-install reliability is required.
- `getRoute` and `getDelivery` perform additional location lookups per delivery, which is simple but can become an N+1 query pattern.
- The delivery form loads all contacts and filters them in the browser. The server still validates contact ownership, but the UI could eventually query contacts by customer.
- The route query uses a Melbourne date string while display parsing uses local `Date` construction; preserve this convention carefully to avoid timezone shifts.
- User-entered `callbackUrl` handling should be reviewed before treating it as trusted redirect input.
- Generated Prisma contract files are linted. Current `npm run lint` fails on `@typescript-eslint/no-empty-object-type` errors in `prisma/contract.d.ts` and the generated migration snapshot, plus unused generated type warnings. These are generated-file/tooling issues, not application TypeScript errors.

## Current validation snapshot

At the time this summary was written:

- `npx tsc --noEmit`: passes.
- `npm run lint`: passes.
- No test script is defined in `package.json`.

## Suggested next implementation order

1. Complete customer detail and management of locations, contacts, and invoice emails; add the missing query/action contracts.
2. Add user-facing error/pending states to server-action forms and decide whether manager-only navigation should be hidden for drivers.
3. Add route/delivery edit and delete semantics, including collision-safe position handling and stronger database constraints where needed.
4. Implement docket capture/generation and secure document/media storage.
5. Add seed data plus focused authorization/action tests, then critical mobile Playwright workflows.
6. Decide how generated contract files are excluded or linted so `npm run lint` is a useful clean check.
7. Add deployment configuration, logging, backups, HTTPS/auth setup, and CI/CD.

## Working conventions for future changes

- Keep feature logic grouped under `features/<domain>/` with `actions.ts`, `queries.ts`, `validation.ts`, `types.ts`, and `components/` where appropriate.
- Treat every server action and query as an authorization boundary; retain explicit role/ownership checks even when a page is protected.
- Use the existing Prisma ORM contract API through `prisma/db.ts`; do not assume classic generated `@prisma/client` APIs.
- Preserve the current App Router/server-component approach and use client components only for interactive form/list behaviour.
- Revalidate affected paths after mutations.
- Keep route dates as `YYYY-MM-DD` strings at the persistence boundary.
