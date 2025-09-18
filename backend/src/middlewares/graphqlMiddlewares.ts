import { Request, Response, NextFunction } from "express";
export function requireJson (req: Request, res: Response, next: NextFunction) {
    if (req.method === "POST" && req.path === "/graphql") {
        const contentType = req.headers["content-type"];
        if(!contentType || !contentType.includes("application/json")) {
            return res.status(415).json({
                code: "UNSUPPORTED_MEDIA_TYPE",
                message: "Content-type must be application/json"
            })
        };
    };

    next();
}