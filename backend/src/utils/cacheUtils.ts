import { localCache } from "../localCache";

export function isWithinSlidingWindowLog (key: string, limit: number, ttlSeconds: number): boolean {
    const now = Date.now();
    const MS = 1000;
    const windowStart = now - ttlSeconds * MS;

    //remove entries that outside of window
    localCache.zRemRangeByScore(key, 0, windowStart);

    //get the count of members
    const count = localCache.zCard(key);

    //SOFT PUNISHMENT (no expiry increment) they need to wait for ttl.
    if(count >= limit) {
        return false
    }

    //add the entry if not exist
    localCache.zAdd(key, now, `${key}-${Math.random()}`);
    localCache.expire(key, ttlSeconds) 
    return true
}