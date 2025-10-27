export const USER_PREPARED_STATEMENTS = {
  createUser: {
    name: 'create_user',
    text: `
            INSERT INTO public.users (display_name, phone_no, email, password_hash) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `,
  },

  getUserByEmail: {
    name: 'get_user_by_email',
    text: `
            SELECT id, password_hash FROM users WHERE email = $1
        `,
  },

  getSellerById: {
    name: 'get_seller_by_id',
    text: `
      SELECT id FROM sellers WHERE id = $1;
    `,
  },
} as const;

export default USER_PREPARED_STATEMENTS;
