#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/30dbf9ea60f14ba627e79519f0a0e37efa2e2eac21f2c33cdf9e0445e5d65b36/contract';
import endContract from '../../snapshots/30dbf9ea60f14ba627e79519f0a0e37efa2e2eac21f2c33cdf9e0445e5d65b36/contract.json' with { type: 'json' };
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
        table: 'contact',
        columns: [
          col('customerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phoneNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'customer',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rate', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'delivery',
        columns: [
          col('contactId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('locationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('routeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tankDetails', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'docket',
        columns: [
          col('batchNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('deliveryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('repName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('repSignature', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('volume', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'invoiceEmail',
        columns: [
          col('customerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('emailAddress', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'location',
        columns: [
          col('address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('customerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
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
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
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
        table: 'docket',
        constraint: 'docket_deliveryId_key',
        columns: ['deliveryId'],
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
        table: 'contact',
        index: 'contact_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'delivery',
        index: 'delivery_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'delivery',
        index: 'delivery_locationId_idx_7aae3038',
        columns: ['locationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'delivery',
        index: 'delivery_routeId_idx_91ae2fd6',
        columns: ['routeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'invoiceEmail',
        index: 'invoiceEmail_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'location',
        index: 'location_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'route',
        index: 'route_assignedUserId_idx_d0c6c9aa',
        columns: ['assignedUserId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'contact',
        foreignKey: {
          name: 'contact_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'customer', columns: ['id'] },
        },
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
        table: 'delivery',
        foreignKey: {
          name: 'delivery_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'location', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'delivery',
        foreignKey: {
          name: 'delivery_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'contact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'docket',
        foreignKey: {
          name: 'docket_deliveryId_fkey',
          columns: ['deliveryId'],
          references: { schema: 'public', table: 'delivery', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'invoiceEmail',
        foreignKey: {
          name: 'invoiceEmail_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'customer', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'location',
        foreignKey: {
          name: 'location_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'customer', columns: ['id'] },
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
