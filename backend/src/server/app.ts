import express from 'express';
import cors from 'cors';
import { router } from '../routes/router';
import { jsonSyntaxErrorAndEmptyBodyHandler } from '../middlewares/formatHandler';
import { swaggerSpec } from '../swagger';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from '../routes/authRouter';
import { traceRequest } from '../middlewares/traceIdGenerator';
import { requireJson } from '../middlewares/graphqlMiddlewares';
import { env } from '../../configs/env';
import { uploadRouter } from '../routes/uploadRouter';

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(traceRequest);

//OAS docs via swagger
if (!env.isProd) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

//routes
app.use('/api', router);
app.use('/api', uploadRouter)
app.use('/v1/auth', authRouter);

//error handlers
app.use(jsonSyntaxErrorAndEmptyBodyHandler);

//graphql shields
app.use(requireJson); //every request must be application/json

export default app;