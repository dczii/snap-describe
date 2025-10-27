import { ApolloServer } from '@apollo/server';
import { Request, Response } from 'express';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from '../graphql/schema/index';
import { resolvers } from '../graphql/resolver/index';
import { createContext } from '../lib/context';
import logger from '../logger';
import db from '../../configs/dbConfig';
import { localCache } from '../localCache';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { GraphQLError, GraphQLFormattedError } from 'graphql';  
import app from './app';
import { env } from '../../configs/env';

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ...(env.isProd ? [ApolloServerPluginLandingPageDisabled()] : []),
  ],
  introspection: !env.isProd,
  // formatError: (
  //   formatError: GraphQLFormattedError,
  //   error: unknown,
  // ): GraphQLFormattedError => {
  //   if (
  //     error instanceof GraphQLError &&
  //     typeof error.extensions?.code === 'string'
  //   ) {
  //     return {
  //       message: error.extensions.code,
  //     };
  //   }
  //   return {
  //     message: 'Internal Server Error',
  //   };
  // },
});

//start server
const port = env.port
async function startServer() {
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: ({ req, res }: { req: Request; res: Response }) =>
        createContext({ req, res }),
    }),
  );

  httpServer.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

//shutdown
let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 1000;

const shutdown = async (signal: string, isFatal: boolean) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.warn(`Received ${signal} signal. Starting graceful shutdown...`);

  const shutdownTimeout = setTimeout(() => {
    logger.warn('Shutdown timeout reached. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    //server shutdown
    logger.info('Stopping Apollo Server...');
    await server.stop();
    logger.info('Apollo Server stopped.');

    logger.info('Closing HTTP Server...');
    await new Promise<void>((resolve) => {
      if (httpServer.listening) {
        httpServer.close((err) => {
          if (
            err &&
            (err as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING'
          ) {
            logger.error(`HTTP Server closing error: ${err.message}`);
          } else {
            logger.info('Manually closed HTTP server.');
          }
          resolve();
        });
      } else {
        logger.info('HTTP Server already closed by Apollo Server.');
        resolve();
      }
    });

    //additional cleanup
    logger.info('Disconnecting from database...');
    await db.end();
    logger.info('Database disconnected.');

    clearTimeout(shutdownTimeout);
    if (isFatal) {
      logger.debug('Server terminated due to error.');
      process.exit(1);
    } else {
      logger.info('Server shutdown gracefully.');
      process.exit(0);
    }
  } catch (error) {
    clearTimeout(shutdownTimeout);
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

//listener
process.on('SIGINT', (sig) => {
  localCache.destroy();
  shutdown(sig, false);
});
process.on('SIGTERM', (sig) => {
  localCache.destroy();
  shutdown(sig, false);
});

process.once('uncaughtException', (err) => {
  logger.debug('Uncaught exception:', err);
  localCache.destroy();
  shutdown('UNCAUGHT_EXCEPTION', true);
});

process.once('unhandledRejection', (err) => {
  logger.debug('Unhandled rejection:', err);
  localCache.destroy();
  shutdown('UNHANDLED_REJECTION', true);
});

//start server
startServer().catch((error) => {
  logger.debug('Error starting server:', error);
  process.exit(1);
});
