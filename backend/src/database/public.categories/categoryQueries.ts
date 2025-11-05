import logger from "../../logger";
import { CATEGORY_PREPARED_STATEMENTS } from "./categoryPreparedQueries";
import db from "../../../configs/dbConfig";

export async function getAllCategories() {
    try {
        const {rows} = await db.query(CATEGORY_PREPARED_STATEMENTS.getAllCategories)
        if (!rows) {
            return null
        }
        return rows
    } catch (err) {
        //simple error handler for now
        logger.error(err)
        throw new Error("Database error")
    }
}