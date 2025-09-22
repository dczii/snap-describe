import {Request, Response} from "express"
import { hashClientDevice, getClientIp } from "../utils/authUtils";
import { authServices } from "../services/authServices";
import logger from "../logger";
import { TraceRequest } from "../middlewares/traceIdGenerator";

export const authController = {
    login: async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const ip = getClientIp(req);
        const deviceHash = hashClientDevice(req);

        try {
            const { accessToken, refreshToken } = await authServices.login(email.toLowerCase(), password, ip, deviceHash);
            res.status(200).json({
                message: "Login successful",
                accessToken, 
                refreshToken,
            })
            
        } catch (err) {

            if (err instanceof Error) {
                if (err.message === "RateLimitError")  {
                    return res.status(429).json({code: "RATE_LIMIT", message: "Too Many Request"});
                }
                    
                if (err.message === "InvalidCredentialsError") {
                    return res.status(400).json({code: "INVALID_CREDENTIALS", message: "Incorrect email or password"});
                }
            }

            logger.error("Login error: ", {
                code: "INTERNAL_ERROR",
                message: "Internal Server Error",
                traceId: (req as TraceRequest).traceId,
                endpoint: req.originalUrl,
                stack: err instanceof Error ? err.stack : undefined,
            })
            
            res.status(500).json({
                code: "INTERNAL_ERROR",
                message: "Internal Server Error",
                traceId: (req as TraceRequest).traceId
            })
        }
    },

    register: async (req: Request, res: Response) => {
        const { fullname, phoneNumber, email, password } = req.body;
        const ip = getClientIp(req);
        const deviceHash = hashClientDevice(req);

        try {
            const {accessToken, refreshToken} = await authServices.register(fullname, phoneNumber, email.toLowerCase(), password, ip, deviceHash)
            res.status(200).json({accessToken, refreshToken})
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "RateLimitError")  {
                    return res.sendStatus(429)
                }
                    
                if (err.message === "InvalidCredentialsFormatError") {
                    return res.sendStatus(400)
                }

                if (err.message === "DatabaseError") {
                    return res.status(500).json({message: "Login failed"});
                }
            }
            logger.error(err)
            res.status(500).json({message: "Internal Server Error"})
        }
    }
}