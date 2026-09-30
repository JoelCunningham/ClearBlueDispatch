#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/147df13b297e6b7dfc28b5de2d33ae5cae8d1bcd01a4707c31270f6567574152/contract";
import endContract from "../../snapshots/147df13b297e6b7dfc28b5de2d33ae5cae8d1bcd01a4707c31270f6567574152/contract.json" with { type: "json" };
import type { Contract as Start } from "../../snapshots/7f679c3b8ae95d93d4c2780ae4dedd7bbaa14018be29e76fa19457e1fd9bbaed/contract";
import startContract from "../../snapshots/7f679c3b8ae95d93d4c2780ae4dedd7bbaa14018be29e76fa19457e1fd9bbaed/contract.json" with { type: "json" };
import { Migration, MigrationCLI, col, placeholder } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: "public", table: "User", column: "firstLogin" }),
      this.addColumn({
        schema: "public",
        table: "User",
        column: col("loginTokenExpiry", "timestamptz", {
          codecRef: { codecId: "pg/timestamptz-temporal@1" }
        })
      }),
      this.dataTransform(endContract as unknown as End, "backfill-User-loginTokenExpiry", {
        check: () => placeholder("backfill-User-loginTokenExpiry:check"),
        run: () => placeholder("backfill-User-loginTokenExpiry:run")
      }),
      this.setNotNull({ schema: "public", table: "User", column: "loginTokenExpiry" }),
      this.addColumn({
        schema: "public",
        table: "User",
        column: col("loginTokenHash", "text", { codecRef: { codecId: "pg/text@1" } })
      }),
      this.dataTransform(endContract as unknown as End, "backfill-User-loginTokenHash", {
        check: () => placeholder("backfill-User-loginTokenHash:check"),
        run: () => placeholder("backfill-User-loginTokenHash:run")
      }),
      this.setNotNull({ schema: "public", table: "User", column: "loginTokenHash" }),
      this.dropNotNull({ schema: "public", table: "User", column: "passwordHash" })
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
