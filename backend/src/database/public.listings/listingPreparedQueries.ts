const LISTING_PREPARED_STATEMENTS = {
  createListing: {
    name: 'create_listing',
    text: `
            INSERT INTO public.listings (seller_id, title, description, price, quantity, condition, category_id, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id; 
        `,
  },
  insertListingPhotos: {
    name: 'insert_listing_photos',
    text: `
            INSERT INTO public.listing_photos (listing_id, image_id, sort_order)
            VALUES 
        `,
  },
  getHomepageListings: {
    name: 'get_homepage_listings',
    text: `
        SELECT 
            l.title, l.price, 
            COALESCE(ua.city, 'Unknown location') AS city, 
            i.file_url AS "fileUrl"
        FROM public.listing_photos lp
        INNER JOIN public.listings l
        ON lp.listing_id = l.id
        INNER JOIN public.images i
        ON lp.image_id = i.id
        INNER JOIN public.sellers s
        ON l.seller_id = s.id
        LEFT JOIN public.user_addresses ua
        ON s.id = ua.user_id
        WHERE lp.sort_order = 0
            AND l.status = 'Available';
    `,
  },
};

export default LISTING_PREPARED_STATEMENTS;
