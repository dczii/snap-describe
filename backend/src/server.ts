import {ApolloServer} from "@apollo/server";
import express, {Request, Response} from "express";
import http from "http";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {expressMiddleware} from "@as-integrations/express5";
import cors from "cors";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";
import { createContext } from "./lib/context";
import logger from "./logger";
import { prisma } from "./lib/prismaConn";
import { router } from "./routes/router";
import { localCache } from "./localCache";
import { jsonSyntaxErrorAndEmptyBodyHandler } from "./middlewares/formatHandler";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes/authRouter";
import { traceRequest } from "./middlewares/traceIdGenerator";

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    introspection: process.env.NODE_ENV !== "production",
    formatError: (err) => {
        return {
            message: err.message
        }
    }
});

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,  
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(traceRequest)

//OAS docs via swagger
if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

//routes
app.use("/api", router)
app.use("/v1/auth", authRouter)

//error handlers
app.use(jsonSyntaxErrorAndEmptyBodyHandler);

//start server
const port = process.env.PORT || 4000; // put in env later
async function startServer() {
    await server.start();
    app.use("/graphql", expressMiddleware(server, {
        context: ({req, res} : {req: Request, res: Response}) =>  createContext({req, res}), 
    }));

    httpServer.listen(port, () => {
        logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);
    })
}

//shutdown
let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 1000;

const shutdown = async (signal: string, isFatal: boolean) => {
    if(isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(`Received ${signal} signal. Starting graceful shutdown...`);

    const shutdownTimeout = setTimeout(() => {
        logger.warn("Shutdown timeout reached. Forcing exit.");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    try {
        //server shutdown
        logger.info("Stopping Apollo Server...");
        await server.stop();
        logger.info("Apollo Server stopped.");

        logger.info("Closing HTTP Server...");
        await new Promise<void>((resolve) => {
            if(httpServer.listening) {
                httpServer.close((err) => {
                    if(err && (err as NodeJS.ErrnoException).code !== "ERR_SERVER_NOT_RUNNING") {
                        logger.error(`HTTP Server closing error: ${err.message}`)
                    } else {
                        logger.info("Manually closed HTTP server.");
                    }
                    resolve()
                });
            } else {
                logger.info("HTTP Server already closed by Apollo Server.");
                resolve()
            }
        });

        //additional cleanup
        logger.info("Disconnecting from database...");
        await prisma.$disconnect()  
        logger.info("Database disconnected.");

        clearTimeout(shutdownTimeout);
        if(isFatal) {
            logger.debug("Server terminated due to error.");
            process.exit(1);
        } else {
            logger.info("Server shutdown gracefully.");
            process.exit(0)
        }
        
    } catch (error) {
        clearTimeout(shutdownTimeout)
        logger.debug("Error during shutdown:", error);
        process.exit(1)
    }
}

//listener
process.on("SIGINT", (sig) => {
    localCache.destroy()
    shutdown(sig, false)
   
});
process.on("SIGTERM", (sig) => {
    localCache.destroy()
    shutdown(sig, false)
    
});

process.once("uncaughtException", (err) => {
    logger.debug("Uncaught exception:", err)
    localCache.destroy()
    shutdown("UNCAUGHT_EXCEPTION", true)
});

process.once("unhandledRejection", (err) => {
    logger.debug("Unhandled rejection:", err)
    localCache.destroy()
    shutdown("UNHANDLED_REJECTION", true)
});

//start server
startServer().catch((error) => {
    logger.debug("Error starting server:", error);
    process.exit(1); 
});