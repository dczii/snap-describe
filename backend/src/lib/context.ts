import { prisma } from "./prismaConn";
import { Request, Response } from "express";
import { verifyAccessToken } from "../services/jwtUtils";

export async function createContext({req, res}: {req: Request, res: Response}){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Bearer format only
    
    if(!token) { //baka mag lologin palang kaya walang token
        return {
            res,
            prisma
        }
    }

    try {
        const decodedPayload = verifyAccessToken(token);
        return {
            userId: decodedPayload, // note: lagyan ng id wala pa kasing types eh.
        }
    } catch (error: unknown) {
        if(error instanceof Error && error.name === "TokenExpiredError") {
            console.error("Access token expired:", error.message);
            return {
                res,
                prisma,
                isExpired: true,
            }
        }
        //fallback for invalid token
        console.error("An unexpected error occurred while verifying the token:", error);
        return {
            res,
            prisma,
        }
    }
}