import express from 'express';
import type { Request, Response } from 'express';
import authRouter from './routes/auth.routes';
import pivotRouter from './routes/pivot.routes';
import { irrigationRoutes } from './routes/irrigation.routes';

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Api funcionando' });
  });

  app.use('/auth', authRouter);
  app.use('/pivots', pivotRouter);
  app.use('/irrigations', irrigationRoutes);

  return app;
};
