import { PrismaClient } from "@prisma/client";
import { createAccessToken, createRefreshToken, verifyAccessToken } from "../utils/jwtUtils";
import { prisma } from "../lib/prismaConn";
import { isWithinSlidingWindowLog } from "../utils/cacheUtils";
import { isPhNum, isValidEmail, isValidPassword } from "../utils/validators";
import { createUser, getUserByEmail } from "../data-access/user";
import bcrypt from "bcrypt"

class AuthServices {
    //login global rate limits
    private GLOBAL_LOGIN_LIMIT: number = 100;
    private GLOBAL_LOGIN_WINDOW: number = 60;

    //registration global rate limits
    private GLOBAL_REGISTER_LIMIT: number = 50;
    private GLOBAL_REGISTER_WINDOW: number = 60;

    //client rate limits
    private SWL_IP_LIMIT: number = 20;
    private SWL_DEVICE_LIMIT: number = 10;
    private SWL_PHONE_NUM_LIMIT: number = 5;
    private SWL_EMAIL_LIMIT: number = 5;
    private SWL_WINDOW: number = 60

    constructor(private prisma: PrismaClient ) {}

    buildAuthContext(authHeader: string) {
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return {
                prisma: this.prisma
            }
        }

        try {
            const decodedToken = verifyAccessToken(token)
            return {
                prisma: this.prisma,
                userId: decodedToken.userId ?? null,
                deviceHash: decodedToken.device ?? null
            }

        } catch (err: unknown) {
            if (err instanceof Error && err.name === "TokenExpiredError") {
               
                throw err
            }

            //fallback
            throw err 
        }
    }

    async login (email: string, password: string, ip: string, deviceHash: string) {
        //keys
        const globalKey = `swl:login:global`
        const ipKey = `swl:login:ip:${ip}`;
        const emailKey = `swl:login:email:${email}`;
        const deviceKey = `swl:login:device:${deviceHash}`;

        //check limits & clean windows
        if(!isWithinSlidingWindowLog( ipKey, this.SWL_IP_LIMIT, this.SWL_WINDOW )) throw new Error("RateLimitError");
        if(!isWithinSlidingWindowLog( deviceKey, this.SWL_DEVICE_LIMIT, this.SWL_WINDOW )) throw new Error("RateLimitError");
        if(!isWithinSlidingWindowLog( globalKey, this.GLOBAL_LOGIN_LIMIT, this.GLOBAL_LOGIN_WINDOW )) throw new Error("RateLimitError");

        //validate client input
        if(!isValidEmail(email) || !isValidPassword(password)) throw new Error("InvalidCredentialsError");

        //check if user Exist end compare password
        const user = await getUserByEmail(email);
        if(!user) throw new Error("InvalidCredentialsError");

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if(!isMatch) throw new Error("InvalidCredentialsError");

        //check limits & clean windows (for existing email only)
        if(!isWithinSlidingWindowLog(emailKey, this.SWL_EMAIL_LIMIT, this.SWL_WINDOW)) throw new Error("RateLimitError");
        
        //create tokens
        const payload = {
            userId: user.id,
            device: deviceHash
        }
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
        return {
            accessToken,
            refreshToken
        }
    }

    async register (
        fullname: string, 
        phoneNumber: string, 
        email: string, 
        password: string, 
        ip: string, 
        deviceHash: string
    ) {
        //keys
        const globalKey = `swl:register:global`;
        const ipKey = `swl:register:ip:${ip}`;
        const deviceKey = `swl:register:device:${deviceHash}`
        const emailKey = `swl:register:email:${email}`
        const phoneKey = `swl:register:phone:${phoneNumber}`

         //check limits & clean windows for client credentials
        if(!isWithinSlidingWindowLog( ipKey, this.SWL_IP_LIMIT, this.SWL_WINDOW )) throw new Error("RateLimitError");
        if(!isWithinSlidingWindowLog( deviceKey, this.SWL_DEVICE_LIMIT, this.SWL_WINDOW )) throw new Error("RateLimitError");
        if(!isWithinSlidingWindowLog( globalKey, this.GLOBAL_REGISTER_LIMIT, this.GLOBAL_REGISTER_WINDOW )) throw new Error("RateLimitError");

        //validate client input
        if(!isValidEmail(email) || !isValidPassword(password) || !isPhNum(phoneNumber)) throw new Error("InvalidCredentialsError");

        //no cp number checks for now
        const isUserExist = await getUserByEmail(email)
        if(isUserExist) throw new Error("AlreadyExist");
        
        //check limits & clean windows for email and phoneNumber
        if(
            !isWithinSlidingWindowLog( emailKey, this.SWL_EMAIL_LIMIT, this.SWL_WINDOW) ||
            !isWithinSlidingWindowLog( phoneKey, this.SWL_PHONE_NUM_LIMIT, this.SWL_WINDOW)
        ) throw new Error("RateLimitError");

        //create new user and prepare tokens
        const newUser = await createUser(fullname, phoneNumber, email, password);
        if(!newUser) throw new Error("DatabaseError");

        const payload = {
            userId: newUser.id,
            device: deviceHash
        };
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        return {
            accessToken,
            refreshToken
        }
    }
}

export const authServices = new AuthServices(prisma)