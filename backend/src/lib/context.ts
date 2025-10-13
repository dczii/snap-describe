import db from "../../configs/dbConfig";
import { Request, Response } from "express";
import logger from "../logger";
import { authContext } from "../services/authServices";
import { Pool } from "pg";

export interface GraphQLContext {
    userId?: string | null,
    deviceHash?: string | null,
    res: Response,
    db: Pool,
    isExpired?: boolean 
}
export async function createContext({req, res}: {req: Request, res: Response}): Promise<GraphQLContext>{
    const authHeader = req.headers.authorization || "";

    try {
        return {
            res,
            ...authContext(authHeader) 
        }
    } catch (error: unknown) {
        if(error instanceof Error && error.name === "TokenExpiredError") {
            logger.error("Access token expired:", error.message);
            return {
                res,
                db,
                isExpired: true,
            }
        }
        //fallback for invalid token
        console.error("An unexpected error occurred while verifying the token:", error);
        return {
            res,
            db,
        }
    }
}