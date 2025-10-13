/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType('address_type', ['shipping', 'seller']);

  //user-account
  pgm.createTable(
    { schema: 'public', name: 'users' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      display_name: { type: 'varchar(100)', notNull: true },
      phone_no: { type: 'varchar(11)', notNull: true, unique: true },
      email: { type: 'varchar(120)', notNull: true, unique: true },
      password_hash: { type: 'varchar(255)', notNull: true },
      role: { type: 'user_role', notNull: true, default: 'buyer' },
      verified: { type: 'boolean', notNull: true, default: false },
      rating_avg: { type: 'numeric(3,2)', notNull: true, default: 0.0 },
      rating_count: { type: 'int', notNull: true, default: 0 },
      status: { type: 'account_status', notNull: true, default: 'active' },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
      updated_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );

  //user PIIs
  pgm.createTable(
    { schema: 'public', name: 'user_profiles' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        unique: true,
        references: 'public.users(id)',
        onDelete: 'CASCADE',
      },
      firstname: { type: 'varchar(30)', notNull: true },
      middlename: { type: 'varchar(30)' },
      lastname: { type: 'varchar(30)', notNull: true },
      dob: { type: 'date', notNull: true },
      gender: { type: 'gender', notNull: true },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
      updated_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );

  //user addresses
  pgm.createTable(
    { schema: 'public', name: 'user_addresses' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'public.users(id)',
        onDelete: 'CASCADE',
      },
      address_type: { type: 'address_type', notNull: true },
      recipient_name: { type: 'varchar(100)' },
      recipient_phone_no: { type: 'varchar(11)' },
      is_default: { type: 'boolean', notNull: true, default: false },
      unit_or_house_no: { type: 'varchar(30)', notNull: true },
      street_or_building: { type: 'varchar(50)', notNull: true },
      district: { type: 'varchar(50)', notNull: true },
      city: { type: 'varchar(50)', notNull: true },
      region: { type: 'varchar(50)', notNull: true },
      country: { type: 'varchar(100)', notNull: true, default: 'Philippines' },
      postal_code: { type: 'varchar(30)', notNull: true },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
      updated_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );
  //index for fast lookups
  pgm.createIndex({ schema: 'public', name: 'user_addresses' }, 'user_id', {
    name: 'idx_user_addresses_user_id',
    ifNotExists: true,
  });
  pgm.createIndex(
    { schema: 'public', name: 'user_addresses' },
    'address_type',
    {
      name: 'idx_user_addresses_type',
      ifNotExists: true,
    },
  );
  pgm.createIndex(
    { schema: 'public', name: 'user_addresses' },
    ['user_id', 'is_default'],
    {
      name: 'idx_user_addresses_user_id_default',
      ifNotExists: true,
    },
  );

  //seller profiles (seller)
  pgm.createTable(
    { schema: 'public', name: 'sellers' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        references: 'public.users(id)',
        onDelete: 'CASCADE',
      },
      verified_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );

  //image metadata
  pgm.createTable(
    { schema: 'public', name: 'images' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'public.users(id)',
        onDelete: 'CASCADE',
      },
      file_url: { type: 'text', notNull: true },
      file_path: { type: 'text', notNull: true },
      file_name: { type: 'varchar(100)', notNull: true },
      file_size: { type: 'BIGINT', notNull: true },
      mime_type: { type: 'varchar(30)', notNull: true },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
      updated_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable({ schema: 'public', name: 'images' }, { ifExists: true });

  pgm.dropTable({ schema: 'public', name: 'sellers' }, { ifExists: true });

  pgm.dropIndex(
    { schema: 'public', name: 'user_addresses' },
    ['user_id', 'is_default'],
    { ifExists: true },
  );
  pgm.dropIndex(
    { schema: 'public', name: 'user_addresses' },
    ['address_type'],
    { ifExists: true },
  );
  pgm.dropIndex({ schema: 'public', name: 'user_addresses' }, ['user_id'], {
    ifExists: true,
  });
  pgm.dropTable(
    { schema: 'public', name: 'user_addresses' },
    { ifExists: true },
  );

  pgm.dropTable(
    { schema: 'public', name: 'user_profiles' },
    { ifExists: true },
  );

  pgm.dropTable({ schema: 'public', name: 'users' }, { ifExists: true });
  pgm.dropType('address_type', { ifExists: true });
};
