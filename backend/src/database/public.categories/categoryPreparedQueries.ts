export const CATEGORY_PREPARED_STATEMENTS = {
    getCategoryNames: {
        name: "get_category_names",
        text: `
            SELECT name
            FROM categories;
        `
    },

    getAllCategories: {
        name: "get_all_categories",
        text: `
            SELECT id, name, slug, parent_id AS "parentId"
            FROM categories;
        `
    }
} as const