// npx tsx scripts/create-user.ts "test@example.com" "Test Manager" "YourTestPassword123" MANAGER

import bcrypt from "bcryptjs";

import { db } from "../prisma/db";

const email = process.argv[2];
const name = process.argv[3];
const password = process.argv[4];
const role = process.argv[5] ?? "MANAGER";

if (!email || !name || !password) {
  console.error("Usage: npx tsx scripts/create-user.ts <email> <name> <password> [DRIVER|MANAGER]");

  process.exit(1);
}

if (role !== "DRIVER" && role !== "MANAGER") {
  console.error("Role must be DRIVER or MANAGER.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
const existingUser = await db.orm.public.User.first({
  email
});

if (existingUser) {
  console.error(`A user with email ${email} already exists.`);

  process.exit(1);
}

const user = await db.orm.public.User.create({
  email,
  name,
  role,
  passwordHash
});

console.log(`Created ${user.role} user: ${user.email}`);
