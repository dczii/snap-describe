import { Router } from "express";
import { createHashedClientSignature, getClientIp } from "../utils/authUtils";
import { localCache } from "../localCache";
import logger from "../logger";

export const loginRouter = Router();

//rate limiter config (limits)
const GLOBAL_LIMIT = 100;
const GLOBAL_WINDOW = 60;

const SWL_IP_LIMIT = 50;
const SWL_DEVICE_LIMIT = 10;
const SWL_EMAIL_LIMIT = 5;
const SWL_TTL = 60;

loginRouter.post("/login", (req, res) => {
    const {email, password} = req.body;
    const ip = getClientIp(req);
    const device_hash = createHashedClientSignature(req);

    //key
    const globalKey = `swl:login:global`;
    const ipKey = `swl:login:ip:${ip}`;
    const deviceKey = `swl:login:device:${device_hash}`;
    const emailKey = `swl:login:email:${email}`;
    
    try {
        const isGlobalAllowed = swlCheck(globalKey, GLOBAL_LIMIT, GLOBAL_WINDOW);
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
    logger.info(count)
    if(count >= limit) {
        return false
    }

    localCache.zAdd(key, now, `${key}-${Math.random()}`);
    localCache.expire(key, ttlSeconds)

    return true
}
