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
    //user-account
    pgm.createTable({schema: "public", name: "users"}, {
        id: {type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()")},
        display_name: {type: "varchar(100)", notNull: true},
        phone_no: {type: "varchar(11)", notNull: true, unique: true},
        email: {type: "varchar(120)", notNull: true, unique: true},
        password_hash: {type: "varchar(255)", notNull: true},
        role: {type: "user_role", notNull: true, default: "buyer"},
        verified: {type: "boolean", notNull: true, default: false},
        rating_avg: {type: "numeric(3,2)", notNull: true, default: 0.00},
        rating_count: {type: "int", notNull: true, default: 0},
        status: {type: "account_status", notNull: true, default: "active"},
        created_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")},
        updated_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")}
    });

    //user PIIs
    pgm.createTable({schema: "public", name: "user_profiles"}, {
        id: {type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()")},
        user_id: {type: "uuid", notNull: true, unique: true, references: "public.users(id)", onDelete: "CASCADE"},
        firstname: {type: "varchar(30)", notNull: true},
        middlename: {type: "varchar(30)"},
        lastname: {type: "varchar(30)", notNull: true},
        dob: {type: "date", notNull: true},
        gender: {type: "gender", notNull: true},
        created_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")},
        updated_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")}
    });

    //user addresses 
    pgm.createTable({schema: "public", name: "user_addresses"}, {
        id: {type: "serial", primaryKey: true},
        user_id: {type: "uuid", notNull: true, references: "public.users(id)", onDelete: "CASCADE"},
        recipient_name: {type: "varchar(100)", notNull: true},
        recipient_phone_no: {type: "varchar(11)", notNull: true},
        unit_or_house_no: {type: "varchar(30)", notNull: true},
        street_or_building: {type: "varchar(50)", notNull: true},
        district: {type: "varchar(50)", notNull: true},
        city: {type: "varchar(50)", notNull: true},
        region: {type: "varchar(50)", notNull: true},
        country: {type: "varchar(100)", notNull: true, default: "Philippines"},
        postal_code: {type: "varchar(30)", notNull: true},
        is_default: {type: "boolean", notNull: true, default: false},
        created_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")}
    });

    //seller profiles (seller)
    pgm.createTable({schema: "public", name: "sellers"}, {
        id: {type: "uuid", primaryKey: true, references: "public.users(id)", onDelete: "CASCADE"},
        seller_type: {type: "seller_type", notNull: true, default: "casual"},
        verified_at: {type: "timestamptz", notNull: true, default: pgm.func("NOW()")},
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: "public", name: "sellers"}, {ifExists: true});
    pgm.dropTable({schema: "public", name: "user_addresses"}, {ifExists: true});
    pgm.dropTable({schema: "public", name: "user_profiles"}, {ifExists: true});
    pgm.dropTable({schema: "public", name: "users"}, {ifExists: true})
};
