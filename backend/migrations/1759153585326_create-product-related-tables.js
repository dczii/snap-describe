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
  //categories of product
  pgm.createTable(
    { schema: 'public', name: 'categories' },
    {
      id: { type: 'serial', primaryKey: true },
      name: { type: 'varchar(120)', notNull: true },
      slug: { type: 'varchar(120)', notNull: true, unique: true },
      parent_id: {
        type: 'int',
        references: 'public.categories(id)',
        default: null,
        onDelete: 'SET NULL',
      },
    },
  );

  //products listings, this is also the product info.
  pgm.createTable(
    { schema: 'public', name: 'listings' },
    {
      id: { type: 'BIGSERIAL', primaryKey: true },
      seller_id: {
        type: 'uuid',
        notNull: true,
        references: 'public.sellers(id)',
      },
      title: { type: 'varchar(180)', notNull: true },
      description: { type: 'text' },
      price: {
        type: 'numeric(12,2)',
        notNull: true,
        default: 1,
        check: 'price >= 0',
      },
      quantity: {
        type: 'int',
        notNull: true,
        default: 1,
        check: 'quantity >= 0',
      },
      condition: { type: 'listing_condition', notNull: true, default: 'New' },
      category_id: {
        type: 'int',
        notNull: true,
        references: 'public.categories(id)',
        onDelete: 'SET DEFAULT',
      },
      notes: { type: 'text' },
      status: { type: 'listing_status', notNull: true, default: 'Available' },
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
  //indexes for fast lookups
  pgm.createIndex({ schema: 'public', name: 'listings' }, 'category_id', {
    name: 'idx_listings_category',
    ifNotExists: true,
  });
  pgm.createIndex({ schema: 'public', name: 'listings' }, 'status', {
    name: 'idx_listings_status',
    ifNotExists: true,
  });
  pgm.createIndex({ schema: 'public', name: 'listings' }, 'price', {
    name: 'idx_listings_price',
    ifNotExists: true,
  });

  //product listing photos
  pgm.createTable(
    { schema: 'public', name: 'listing_photos' },
    {
      listing_id: {
        type: 'BIGINT',
        notNull: true,
        references: 'public.listings(id)',
        onDelete: 'CASCADE',
      },
      image_id: {
        type: 'uuid',
        notNull: true,
        references: 'public.images(id)',
        onDelete: 'CASCADE',
      },
      sort_order: { type: 'int', notNull: true, default: 0 },
    },
  );

  //composition key
  pgm.createConstraint(
    { schema: 'public', name: 'listing_photos' },
    'listing_photos_pkey',
    {
      primaryKey: ['listing_id', 'image_id'],
    },
  );

  //orders
  pgm.createTable(
    { schema: 'public', name: 'orders' },
    {
      id: { type: 'BIGSERIAL', primaryKey: true },
      buyer_id: { type: 'uuid', notNull: true, references: 'public.users(id)' },
      seller_id: {
        type: 'uuid',
        notNull: true,
        references: 'public.sellers(id)',
      },
      subtotal: {
        type: 'numeric(12, 2)',
        notNull: true,
        check: 'subtotal >= 0',
      },
      shipping_fee: {
        type: 'numeric(12, 2)',
        notNull: true,
        default: 0,
        check: 'shipping_fee >= 0',
      },
      total_price: {
        type: 'numeric(12, 2)',
        generated: {
          as: 'subtotal + shipping_fee',
          stored: true,
        },
      },
      payment_method: { type: 'payment_method', notNull: true },
      delivery_method: {
        type: 'varchar(20)',
        notNull: true,
        default: 'Shipping',
      },
      status: { type: 'order_status', notNull: true, default: 'Pending' },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
    },
  );
  //indexes for fast lookups and history lookups
  pgm.createIndex(
    { schema: 'public', name: 'orders' },
    [{ name: 'buyer_id' }, { name: 'created_at', sort: 'DESC' }],
    {
      name: 'idx_orders_buyer_id_created_at',
      ifNotExists: true,
    },
  );
  pgm.createIndex(
    { schema: 'public', name: 'orders' },
    [{ name: 'seller_id' }, { name: 'created_at', sort: 'DESC' }],
    {
      name: 'idx_orders_seller_id_created_at',
      ifNotExists: true,
    },
  );

  //list of items per order
  pgm.createTable(
    { schema: 'public', name: 'order_items' },
    {
      id: { type: 'BIGSERIAL', primaryKey: true },
      order_id: {
        type: 'BIGINT',
        notNull: true,
        references: 'public.orders(id)',
      },
      listing_id: {
        type: 'BIGINT',
        notNull: true,
        references: 'public.listings(id)',
      },
      title_snapshot: { type: 'varchar(180)', notNull: true },
      price_snapshot: {
        type: 'numeric(12, 2)',
        notNull: true,
        check: 'price_snapshot >= 0',
      },
      quantity: { type: 'int', notNull: true, check: 'quantity > 0' },
    },
  );

  //shipping snapshot
  pgm.createTable(
    { schema: 'public', name: 'order_shipping' },
    {
      order_id: {
        type: 'BIGSERIAL',
        primaryKey: true,
        references: 'public.orders(id)',
        onDelete: 'CASCADE',
      },
      recipient_name: { type: 'varchar(100)', notNull: true },
      recipient_phone_no: { type: 'varchar(11)', notNull: true },
      unit_or_house_no: { type: 'varchar(30)', notNull: true },
      street_or_building: { type: 'varchar(50)', notNull: true },
      district: { type: 'varchar(50)', notNull: true },
      city: { type: 'varchar(50)', notNull: true },
      region: { type: 'varchar(50)', notNull: true },
      postal_code: { type: 'varchar(30)', notNull: true },
      country: { type: 'varchar(100)', notNull: true, default: 'Philippines' },
    },
  );

  //shipments tracking
  pgm.createTable(
    { schema: 'public', name: 'shipments' },
    {
      id: { type: 'BIGSERIAL', primaryKey: true },
      order_id: {
        type: 'BIGINT',
        notNull: true,
        references: 'public.orders(id)',
        onDelete: 'CASCADE',
      },
      status: { type: 'shipment_status', notNull: true, default: 'Pending' },
      carrier: { type: 'varchar(80)' },
      service_level: { type: 'varchar(80)' },
      tracking_number: { type: 'varchar(120)' },
      eta_date: { type: 'date' },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('NOW()'),
      },
      shipped_at: { type: 'timestamptz' },
      delivered_at: { type: 'timestamptz' },
    },
  );
  //index shipments for fastlookups when user monitor it
  pgm.createIndex({ schema: 'public', name: 'shipments' }, 'order_id', {
    name: 'idx_shipments_order',
    ifNotExists: true,
  });

  // Payments
  pgm.createTable(
    { schema: 'public', name: 'payments' },
    {
      id: { type: 'BIGSERIAL', primaryKey: true },
      order_id: {
        type: 'BIGINT',
        notNull: true,
        references: 'public.orders(id)',
        onDelete: 'CASCADE',
      },
      amount: { type: 'numeric(12,2)', notNull: true, check: 'amount >= 0' },
      provider: { type: 'varchar(80)', notNull: true },
      provider_ref: { type: 'varchar(160)' },
      status: { type: 'payment_status', notNull: true, default: 'Initiated' },
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
  //index
  pgm.createIndex({ schema: 'public', name: 'payments' }, 'order_id', {
    name: 'idx_payments_order',
    ifNotExists: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex({ schema: 'public', name: 'payments' }, 'order_id', {
    ifExists: true,
  });
  pgm.dropTable({ schema: 'public', name: 'payments' }, { ifExists: true });

  pgm.dropIndex({ schema: 'public', name: 'shipments' }, 'order_id', {
    ifExists: true,
  });
  pgm.dropTable({ schema: 'public', name: 'shipments' }, { ifExists: true });

  pgm.dropTable(
    { schema: 'public', name: 'order_shipping' },
    { ifExists: true },
  );

  pgm.dropTable({ schema: 'public', name: 'order_items' }, { ifExists: true });

  pgm.dropIndex(
    { schema: 'public', name: 'orders' },
    [{ name: 'buyer_id' }, { name: 'created_at' }],
    { ifExists: true },
  );
  pgm.dropIndex(
    { schema: 'public', name: 'orders' },
    [{ name: 'seller_id' }, { name: 'created_at' }],
    { ifExists: true },
  );
  pgm.dropTable({ schema: 'public', name: 'orders' }, { ifExists: true });

  pgm.dropConstraint(
    { schema: 'public', name: 'listing_photos' },
    'listing_photos_pkey',
    { ifExists: true },
  );
  pgm.dropTable(
    { schema: 'public', name: 'listing_photos' },
    { ifExists: true },
  );

  pgm.dropIndex({ schema: 'public', name: 'listings' }, 'category_id', {
    ifExists: true,
  });
  pgm.dropIndex({ schema: 'public', name: 'listings' }, 'status', {
    ifExists: true,
  });
  pgm.dropIndex({ schema: 'public', name: 'listings' }, 'price', {
    ifExists: true,
  });

  pgm.dropTable({ schema: 'public', name: 'listings' }, { ifExists: true });

  pgm.dropTable({ schema: 'public', name: 'categories' }, { ifExists: true });
};
