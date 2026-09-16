#!/usr/bin/env -S node

import type { Contract as Start } from "../../snapshots/1aff90c9ebed9f8c33a951d6c7d1044cd34fd6ab6b31e64dfdf0034de0e3f1bc/contract";
import startContract from "../../snapshots/1aff90c9ebed9f8c33a951d6c7d1044cd34fd6ab6b31e64dfdf0034de0e3f1bc/contract.json" with { type: "json" };

import type { Contract as End } from "../../snapshots/4b7cbf5bf4ac43749e0dd01457179edf0740ff27911993f451eff270e7e4101e/contract";
import endContract from "../../snapshots/4b7cbf5bf4ac43749e0dd01457179edf0740ff27911993f451eff270e7e4101e/contract.json" with { type: "json" };

import { Migration, MigrationCLI, rawSql } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      rawSql({
        id: "add-location-deleted",
        label: "Add soft-delete flag to locations",
        operationClass: "widening",
        target: { id: "postgres" },

        precheck: [
          {
            description: "Verify location deleted column does not exist",
            sql: `
            SELECT NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'location'
                AND column_name = 'deleted'
            ) AS ok
          `
          }
        ],

        execute: [
          {
            description: "Add deleted column to location",
            sql: `
            ALTER TABLE "public"."location"
            ADD COLUMN "deleted" BOOLEAN NOT NULL DEFAULT false;
          `
          }
        ],

        postcheck: [
          {
            description: "Verify location deleted column exists",
            sql: `
            SELECT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'location'
                AND column_name = 'deleted'
                AND data_type = 'boolean'
                AND is_nullable = 'NO'
            ) AS ok
          `
          }
        ]
      }),

      rawSql({
        id: "add-contact-deleted",
        label: "Add soft-delete flag to contacts",
        operationClass: "widening",
        target: { id: "postgres" },

        precheck: [
          {
            description: "Verify contact deleted column does not exist",
            sql: `
            SELECT NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'contact'
                AND column_name = 'deleted'
            ) AS ok
          `
          }
        ],

        execute: [
          {
            description: "Add deleted column to contact",
            sql: `
            ALTER TABLE "public"."contact"
            ADD COLUMN "deleted" BOOLEAN NOT NULL DEFAULT false;
          `
          }
        ],

        postcheck: [
          {
            description: "Verify contact deleted column exists",
            sql: `
            SELECT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'contact'
                AND column_name = 'deleted'
                AND data_type = 'boolean'
                AND is_nullable = 'NO'
            ) AS ok
          `
          }
        ]
      })
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
