import { Router, Request, Response } from "express";
import { createHashedClientSignature, getClientIp } from "../utils/authUtils";
import { localCache } from "../localCache";
import logger from "../logger";
import { isValidEmail, isValidPassword } from "../lib/validators";
import { prisma } from "../lib/prismaConn";
import bcrypt from "bcrypt"

interface UserDTO { //Temporary 
    id: string
    email: string
    display_name: string
    password_hash: string
    status: string
    created_at: Date
}

export const loginRouter = Router();

//rate limiter options (limits)
const GLOBAL_LIMIT = 100;
const GLOBAL_WINDOW = 60;

const SWL_IP_LIMIT = 50;
const SWL_DEVICE_LIMIT = 10;
const SWL_EMAIL_LIMIT = 5;
const SWL_TTL = 60;

loginRouter.post("/login", async (req: Request, res: Response) => {
    logger.info(JSON.stringify(localCache.getStats()));
    const {email, password} = req.body;
    const ip = getClientIp(req);
    const device_hash = createHashedClientSignature(req);

    //key
    const globalKey = `swl:login:global`;
    const ipKey = `swl:login:ip:${ip}`;
    const deviceKey = `swl:login:device:${device_hash}`;
    const emailKey = `swl:login:email:${email}`;
    

    //no fraud detection for now
    try {
        
        //check swl limits
        const isGlobalAllowed = swlCheck(globalKey, GLOBAL_LIMIT, GLOBAL_WINDOW);
        if(!isGlobalAllowed) return res.sendStatus(429);

        const isIpAllowed = swlCheck(ipKey, SWL_IP_LIMIT, SWL_TTL);
        if(!isIpAllowed) return res.sendStatus(429);

        const isDeviceAllowed = swlCheck(deviceKey, SWL_DEVICE_LIMIT, SWL_TTL);
        if(!isDeviceAllowed) return res.sendStatus(429);

        if(!isValidEmail(email)) {
            return res.status(400).json({message: "Incorrect email or password."});
        }

        if(!isValidPassword(password)) {
            return res.status(400).json({message: "Incorrect email or password."});
        }
        //check cache first
        let userDTO = localCache.get(email) as UserDTO

        if(!userDTO) {
            //query from database
            userDTO = await prisma.user.findUnique({
                where: {email}
            }) as UserDTO;

            //save to cache for lookups
            localCache.set(email, userDTO);
        }

        //check email limit
        const isEmailAllowed = swlCheck(emailKey, SWL_EMAIL_LIMIT, SWL_TTL);
        if (!isEmailAllowed) return res.status(400).json({message: "Incorrect email or password."});

        //compare password
        if(!(await bcrypt.compare(password, userDTO.password_hash))) {
            return res.status(400).json({message: "Incorrect email or password."});
        };

        res.status(200).json({test: isGlobalAllowed});
    } catch (err) {
        logger.debug(err)
        res.sendStatus(500)
    }
})


function swlCheck (key: string, limit: number, ttlSeconds: number): boolean {
    const now = Date.now();
    const MS = 1000;
    const windowStart = now - ttlSeconds * MS;

    localCache.zRemRangeByScore(key, 0, windowStart);

    const count = localCache.zCard(key);

    logger.info(`Checked: ${key} - ${count}`)
    if(count >= limit) {
        return false
    }

    localCache.zAdd(key, now, `${key}-${Math.random()}`);
    localCache.expire(key, ttlSeconds)

    return true
}




