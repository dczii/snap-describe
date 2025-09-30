/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

/**
 * 
 * 
 */

export const up = (pgm) => {
    pgm.createType("seller_type", ['casual', 'business']);
    pgm.createType("listing_type", ['retail', 'marketplace']);
    pgm.createType("listing_condition", ['New', 'Like New', 'Used', 'Fair']);
    pgm.createType("listing_status", ['Available', 'Sold']);
    pgm.createType("delivery_method", ['Shipping', 'Meetup']);
    pgm.createType("payment_method", ['COD', 'Online']);
    pgm.createType("order_status", ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']);
    pgm.createType("offer_status", ['Pending','Accepted','Declined','Withdrawn','Expired']);
    pgm.createType('shipment_status', ['Pending','LabelCreated','InTransit','Delivered','Failed','Returned']);
    pgm.createType("payment_status", ['Initiated','Authorized','Captured','Failed','Refunded','Voided']);
    pgm.createType("trade_status", ['PendingMeetup','PendingShipment','Completed','Cancelled']);
    pgm.createType("gender", ['male', 'female']);
    pgm.createType("user_role", ["buyer", "seller"]);
    pgm.createType("account_status", ["active", "deactivated"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropType("account_status")
    pgm.dropType("user_role");
    pgm.dropType("seller_type");
    pgm.dropType("listing_type");
    pgm.dropType("listing_condition");
    pgm.dropType("listing_status");
    pgm.dropType("delivery_method");
    pgm.dropType("payment_method");
    pgm.dropType("order_status");
    pgm.dropType("offer_status");
    pgm.dropType('shipment_status');
    pgm.dropType("payment_status");
    pgm.dropType("trade_status");
    pgm.dropType("gender");
};
