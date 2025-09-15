import {Request, Response} from "express"
import { hashClientDevice, getClientIp } from "../utils/authUtils";
import { authServices } from "../services/authServices";
import logger from "../logger";

export const authController = {
    login: async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const ip = getClientIp(req);
        const device_hash = hashClientDevice(req);

        try {
            const { accessToken, refreshToken } = await authServices.login(email, password, ip, device_hash);
            res.status(200).json({accessToken, refreshToken,})
            
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "RateLimitError")  {
                    return res.status(429).json({message: "Too Many Request"});
                }
                    
                if (err.message === "InvalidCredentialsError") {
                    return res.status(400).json({message: "Incorrect email or password"});
                }
            }
            logger.error("Login Error: ", err)
            res.status(500).json({message: "Internal Server Error"})
        }
    },

    register: async (req: Request, res: Response) => {
        logger.info("Hit at register")
        const { fullname, phone_number, email, password } = req.body;
        const ip = getClientIp(req);
        const device_hash = hashClientDevice(req);

        try {
            const {accessToken, refreshToken} = await authServices.register(fullname, phone_number, email, password, ip, device_hash)
            res.status(200).json({accessToken, refreshToken})
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "RateLimitError")  {
                    return res.status(429).json({message: "Too Many Request"});
                }
                    
                if (err.message === "InvalidCredentialsFormatError") {
                    return res.status(400).json({message: "Invalid format"});
                }

                if (err.message === "DatabaseError") {
                    return res.status(400).json({message: "Login failed"});
                }
            }
            logger.error(err)
            res.status(500).json({message: "Internal Server Error"})
        }
    }
}