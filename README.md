# Clear Blue Dispatch

![Clear Blue Dispatch](public/icons/logo.png)

Delivery and docket management for Clear Blue Solutions. Clear Blue Dispatch gives managers and drivers one place to plan routes, track deliveries, manage customers, and produce delivery documentation.

## What it does

- Manage upcoming and historical delivery routes.
- Assign routes to drivers and control access by role.
- Create and update customers, deliveries, and dockets.
- Capture delivery signatures and generate docket PDFs.
- Send customer and internal docket emails.
- Install as a progressive web app and monitor network status.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19 and TypeScript
- [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- [NextAuth.js](https://authjs.dev/) for authentication
- Tailwind CSS 4
- React PDF and React Email for generated documents and messages

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 15 or newer

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with a PostgreSQL connection string:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/clear_blue_dispatch"
   ```

3. Apply the database migrations:

   ```bash
   npx prisma db migrate
   ```

4. Create the first application user. The role must be `MANAGER` or `DRIVER`:

   ```bash
   npx tsx scripts/create-user.ts "manager@example.com" "Example Manager" "change-this-password" MANAGER
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The home route redirects to the routes view, and unauthenticated users are sent to the login page.

## Available commands

| Command                 | Purpose                          |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start the development server     |
| `npm run build`         | Create a production build        |
| `npm run start`         | Run the production build         |
| `npm run lint`          | Run ESLint                       |
| `npm run contract:emit` | Regenerate Prisma contract types |

## Project structure

| Directory     | Purpose                                                 |
| ------------- | ------------------------------------------------------- |
| `app/`        | Next.js routes, pages, and API handlers                 |
| `components/` | Shared UI, navigation, form, and input components       |
| `features/`   | Domain-specific actions, queries, types, and validation |
| `content/`    | PDF and email templates                                 |
| `prisma/`     | Database contract, client, and generated contract files |
| `public/`     | PWA assets, logos, and screenshots                      |

## Database workflow

The database contract lives in [`prisma/contract.prisma`](prisma/contract.prisma). After changing it, regenerate the checked-in contract files:

```bash
npm run contract:emit
```

Use the Prisma migration commands for schema changes and keep migrations in [`migrations/`](migrations/).

## Deployment

Build the application with `npm run build`, then serve it with `npm run start`. Configure `DATABASE_URL` in the deployment environment and ensure the target PostgreSQL instance is running PostgreSQL 15 or newer.
