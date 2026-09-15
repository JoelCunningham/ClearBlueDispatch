#!/usr/bin/env -S node
import type { Contract as Start } from "../../snapshots/47d03e21d646adc90b54ba559ea3596f738bcb06e8526e1f0517408862946472/contract";
import startContract from "../../snapshots/47d03e21d646adc90b54ba559ea3596f738bcb06e8526e1f0517408862946472/contract.json" with { type: "json" };
import type { Contract as End } from "../../snapshots/c183e4f99c772b35664e307de7e209a0d7b4ee58df0a8322ca778b43bbb256f9/contract";
import endContract from "../../snapshots/c183e4f99c772b35664e307de7e209a0d7b4ee58df0a8322ca778b43bbb256f9/contract.json" with { type: "json" };
import { Migration, MigrationCLI, col } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: "public",
        table: "user",
        column: col("passwordHash", "text", {
          codecRef: { codecId: "pg/text@1" },
        }),
      }),
      this.setNotNull({
        schema: "public",
        table: "user",
        column: "passwordHash",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
