import { Pool, PoolConfig, DatabaseError } from "pg";
import logger from "../src/logger";
import { env } from "./env";

const connectionString = env.dbUrl;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
}

const poolConfig: PoolConfig = {
    connectionString,
    ssl: env.isProd 
        ? { rejectUnauthorized: true } 
        : { rejectUnauthorized: false },
    max: env.isProd  ? 20 : 10, 
    min: env.isProd  ? 5 : 2,   
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 30000,
    maxUses: 7500,         
    query_timeout: 20000,        
    statement_timeout: env.isProd  ? 30000 : 60000, //fallback for db server
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    allowExitOnIdle: !env.isProd, 
};

const db = new Pool(poolConfig);

db.on("error", (err): void => {
    if (err instanceof DatabaseError) {
        logger.error("Unexpected error on idle Postgres client", {
            message: err.message,
            stack: err.stack,
            code: err.code,
            detail: err.detail
        });
    } else {
        logger.error("Unknown error on idle Postgres client", { err });
    }
});

export const getPoolStats = () => {
    return {
        totalCount: db.totalCount,      
        idleCount: db.idleCount,        
        waitingCount: db.waitingCount,  
    };
};

export default db

