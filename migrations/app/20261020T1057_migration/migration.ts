#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/147df13b297e6b7dfc28b5de2d33ae5cae8d1bcd01a4707c31270f6567574152/contract';
import startContract from '../../snapshots/147df13b297e6b7dfc28b5de2d33ae5cae8d1bcd01a4707c31270f6567574152/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/96882ed6980909f83dd3cb3ac6e031798f0e432283c504bae3d8bf129e7bc127/contract';
import endContract from '../../snapshots/96882ed6980909f83dd3cb3ac6e031798f0e432283c504bae3d8bf129e7bc127/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'DocketPhoto',
        columns: [
          col('blobId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('contentType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deleted', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('docketId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('size', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'DocketPhoto',
        index: 'DocketPhoto_docketId_idx_087b8b64',
        columns: ['docketId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DocketPhoto',
        foreignKey: {
          name: 'DocketPhoto_docketId_fkey',
          columns: ['docketId'],
          references: { schema: 'public', table: 'Docket', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
