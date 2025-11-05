export const CATEGORY_PREPARED_STATEMENTS = {
    getAllCategories: {
        name: "get_all_categories",
        text: `
            SELECT *
            FROM categories;
        `
    }
} as const