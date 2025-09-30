import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

//only on dev
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
}

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const poolConfig: PoolConfig = {
    connectionString,
    ssl: isProduction 
        ? { rejectUnauthorized: true } 
        : { rejectUnauthorized: false },
    max: isProduction ? 20 : 10, 
    min: isProduction ? 5 : 2,   
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 30000,       
    maxUses: 7500,                 
    statement_timeout: isProduction ? 30000 : 60000,
    query_timeout: 20000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    allowExitOnIdle: isDevelopment, 
};

const db = new Pool(poolConfig);
export default db

export const getPoolStats = () => {
    return {
        totalCount: db.totalCount,      
        idleCount: db.idleCount,        
        waitingCount: db.waitingCount,  
    };
};

