export const USER_PREPARED_QUERIES = {
  createUser: {
    name: 'create_user',
    text: `
            INSERT INTO public.users (display_name, phone_no, email, password_hash) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `,
  },

  getUserByEmailForLogin: {
    name: 'get_user_by_email_login',
    text: `
            SELECT id, password_hash FROM users WHERE email = $1
        `,
  },

  getUserByEmail: {
    name: 'get_user_by_email',
    text: `
            SELECT id, password_hash FROM users WHERE email = $1
        `,
  },
} as const;

export default USER_PREPARED_QUERIES;
