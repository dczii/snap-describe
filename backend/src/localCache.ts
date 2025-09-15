import EventEmitter  from "events";

interface CacheEntry<T> {
    value: T;
    createdAt: number;
    expiredAt: number;
}

interface CacheStats {
total: number;
active: number;
expired: number;
hits: number;
misses: number;
}

interface LocalCacheOptions {
    cleanupIntervalSeconds?: number,
    maxSize?: number | null
}

class LocalCache extends EventEmitter {
    private storage: Map<string, CacheEntry<unknown>>
    private cleanupInterval: NodeJS.Timeout;
    private maxSize: number | null;
    private hits: number
    private misses: number

    constructor({cleanupIntervalSeconds = 30, maxSize = null}:LocalCacheOptions = {}) {
        super() //reuse emit from EventEmitter
        this.storage = new Map();
        this.maxSize = maxSize;
        this.hits = 0;
        this.misses = 0;

        this.cleanupInterval = setInterval(() => {
            this.cleanup()
        }, cleanupIntervalSeconds * 1000).unref();
    }

    set<T>(key: string, value: T, ttlSeconds: number = 300) {
        const MS = 1000;
        const now = Date.now()
        const entry = {
            value,
            createdAt: now,
            expiredAt: now + ttlSeconds * MS
        }

        if (this.maxSize && this.storage.size >= this.maxSize) {
            const oldestKey = this.storage.keys().next().value
            if(oldestKey !== undefined) {
                this.delete(oldestKey)
            }
        }

        this.storage.set(key, entry);
        this.emit("set", {key, value, ttlSeconds});
        return true
    }

    get<T>(key: string): T | null {
        const entry = this.storage.get(key);
        const now = Date.now();
        if(!entry) {
            this.misses++;
            return null;
        }

        if(entry.expiredAt && now >= entry.expiredAt) {
            this.delete(key);
            this.misses++;
            return null;
        }


        this.hits++
        return entry.value as T
    }

    has(key: string): boolean {
        return this.get(key) !== null
    }

    delete(key: string): boolean {
        const existed = this.storage.delete(key);
        if(existed) this.emit("delete", {key})
        return existed !== null
    }

    //sorted set (imitation lang ng behavior).
    zAdd(key: string, score: number, member: string): boolean {
        let zset = this.get<Map<string, number>>(key)

        if(!(zset instanceof Map)){
            zset = new Map<string, number>()
            this.set(key, zset)
        }
        
        zset.set(member, score);
        this.set(key, zset)
        return true;
    }

    zCard(key: string): number {
        const zset = this.get<Map<string, number>>(key);
        return zset ? zset.size : 0
    }

    zRem(key: string, member: string): boolean {
        const zset = this.get<Map<string, number>>(key);

        if(!(zset instanceof Map)) {
            return false
        }

        const result = zset.delete(member);
        if(zset.size === 0) {
            this.delete(key)
        }



        return result
    }

    zRemRangeByScore(key: string, min: number, max: number): number {
        const zset = this.get<Map<string, number>>(key);

        if(!(zset instanceof Map)) {
            return 0
        }

        let removed = 0;

        for (const [member, score] of zset.entries()) {
            if (score >= min && score <= max) {
                zset.delete(member);
                removed++
            }
        }

        this.set(key, zset);

        if(removed > 0) {
            this.emit("zRemRangeByScore", {key, min, max, removed})
        }

        return removed;
    }

    clear(): void {
        this.storage.clear();
        this.emit("clear");
    }

    //monitoring & other gen tools
    expire(key: string, ttlSeconds: number): boolean {
        const entry = this.storage.get(key);
        if(!entry) return false;

        const now = Date.now()
        const MS = 1000;
        entry.expiredAt = now + ttlSeconds * MS
        
        this.storage.set(key, entry);
        this.emit("expire", {key, ttlSeconds});
        return true
    }

    getStats(): CacheStats {
        const now = Date.now();
        let expired = 0;
        let active = 0;

        for (const entry of this.storage.values()) {
            if(entry.expiredAt && now >= entry.expiredAt) {
                expired++;
            } else {
                active++;
            }
        }

        return {
            total: this.storage.size,
            expired,
            active,
            hits: this.hits,
            misses: this.misses
        }
    }

    cleanup(): void {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, entry] of this.storage.entries()) {
            if(entry.expiredAt && now >= entry.expiredAt) {
                this.delete(key)
                cleaned++
            }
        }

        if(cleaned > 0) {
            this.emit("cleanup", {cleaned})
        }
    }

    destroy(): void {
        if(this.cleanupInterval) clearInterval(this.cleanupInterval);
        this.clear()
    }
}

export const localCache = new LocalCache({cleanupIntervalSeconds: 30, maxSize: 5000})

