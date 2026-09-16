#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/1aff90c9ebed9f8c33a951d6c7d1044cd34fd6ab6b31e64dfdf0034de0e3f1bc/contract";
import endContract from "../../snapshots/1aff90c9ebed9f8c33a951d6c7d1044cd34fd6ab6b31e64dfdf0034de0e3f1bc/contract.json" with { type: "json" };
import type { Contract as Start } from "../../snapshots/30dbf9ea60f14ba627e79519f0a0e37efa2e2eac21f2c33cdf9e0445e5d65b36/contract";
import startContract from "../../snapshots/30dbf9ea60f14ba627e79519f0a0e37efa2e2eac21f2c33cdf9e0445e5d65b36/contract.json" with { type: "json" };
import { Migration, MigrationCLI, rawSql } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      rawSql({
        id: "restrict-delivery-location-contact-delete",
        label: "Restrict deletion of locations and contacts referenced by deliveries",
        operationClass: "widening",
        target: { id: "postgres" },

        precheck: [
          {
            description: "Verify delivery foreign keys currently exist",
            sql: `
            SELECT
              EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'delivery_contactId_fkey'
                  AND conrelid = 'public.delivery'::regclass
              )
              AND
              EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'delivery_locationId_fkey'
                  AND conrelid = 'public.delivery'::regclass
              ) AS ok
          `
          }
        ],

        execute: [
          {
            description: "Recreate delivery foreign keys with RESTRICT",
            sql: `
            ALTER TABLE "delivery"
            DROP CONSTRAINT "delivery_contactId_fkey";

            ALTER TABLE "delivery"
            DROP CONSTRAINT "delivery_locationId_fkey";

            ALTER TABLE "delivery"
            ADD CONSTRAINT "delivery_contactId_fkey"
            FOREIGN KEY ("contactId")
            REFERENCES "contact"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

            ALTER TABLE "delivery"
            ADD CONSTRAINT "delivery_locationId_fkey"
            FOREIGN KEY ("locationId")
            REFERENCES "location"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
          `
          }
        ],

        postcheck: [
          {
            description: "Verify delivery foreign keys use RESTRICT",
            sql: `
            SELECT
              EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'delivery_contactId_fkey'
                  AND conrelid = 'public.delivery'::regclass
                  AND confdeltype = 'r'
              )
              AND
              EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'delivery_locationId_fkey'
                  AND conrelid = 'public.delivery'::regclass
                  AND confdeltype = 'r'
              ) AS ok
          `
          }
        ]
      })
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
