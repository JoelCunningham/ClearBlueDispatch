#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/47d03e21d646adc90b54ba559ea3596f738bcb06e8526e1f0517408862946472/contract';
import endContract from '../../snapshots/47d03e21d646adc90b54ba559ea3596f738bcb06e8526e1f0517408862946472/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'delivery',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('routeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tankDetails', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'route',
        columns: [
          col('assignedUserId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('date', 'date', { notNull: true, codecRef: { codecId: 'pg/date-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_0e203bb4', "\"role\" IN ('DRIVER', 'MANAGER')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'route',
        constraint: 'route_assignedUserId_date_key',
        columns: ['assignedUserId', 'date'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'delivery',
        index: 'delivery_routeId_idx_91ae2fd6',
        columns: ['routeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'route',
        index: 'route_assignedUserId_idx_d0c6c9aa',
        columns: ['assignedUserId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'delivery',
        foreignKey: {
          name: 'delivery_routeId_fkey',
          columns: ['routeId'],
          references: { schema: 'public', table: 'route', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'route',
        foreignKey: {
          name: 'route_assignedUserId_fkey',
          columns: ['assignedUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
