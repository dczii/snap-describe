const LISTING_PREPARED_STATEMENTS = {
    createListing: {
        name: "create_listing",
        text: `
            INSERT INTO public.listings (seller_id, title, description, price, quantity, condition, category_id, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id; 
        `
    },
    insertListingPhotos: {
        name: "insert_listing_photos",
        text: `
            INSERT INTO public.listing_photos (listing_id, image_id, sort_order)
            VALUES 
        `
    }
}

export default LISTING_PREPARED_STATEMENTS;