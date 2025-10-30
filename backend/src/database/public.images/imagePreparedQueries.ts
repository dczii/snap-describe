const IMAGE_PREPARED_STATEMENTS = {
  insertImageData: {
    name: 'insert_image_metadata',
    text: `
            INSERT INTO public.images (user_id, file_url, file_path, file_name, file_size, mime_type)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `,
  },

  insertMultiImageData: {
    name: 'insert_multi_image_metadata',
    text: `
            INSERT INTO public.images (user_id, file_url, file_path, file_name, file_size, mime_type) VALUES
        `,
  },
};

export default IMAGE_PREPARED_STATEMENTS;
