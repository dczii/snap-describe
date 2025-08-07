import {ApolloServer} from "@apollo/server";
import express, {Request, Response} from "express";
import http from "http";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {expressMiddleware} from "@as-integrations/express5";
import cors from "cors";
import {config} from "@dotenvx/dotenvx";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";
import { createContext } from "./lib/context";
config({path: ".env.keys"});


const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});

//next time na tokens
app.use(cors({
    origin: "*", // allow all origins for now hehe :D
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 4000;
async function startServer() {
    await server.start();
    app.use("/graphql", expressMiddleware(server, {
        context: ({req, res} : {req: Request, res: Response}) =>  createContext({req, res}), 
    }));

    httpServer.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    })

    const shutdown = async () => {
        console.log("Shutting down server...");
        await server.stop();
        httpServer.close(() => {
            console.log("HTTP server closed.");
        });
        console.log("Server shutdown complete.");
        process.exit(0); //suckcess shutdown
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1); // failed to start tsk tsk tsk
});