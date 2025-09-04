import { Router } from 'express';
import { IrrigationController } from '../controllers/IrrigationController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const irrigationRoutes = Router();

irrigationRoutes.use(authMiddleware);

irrigationRoutes.get('/', IrrigationController.list);

irrigationRoutes.post('/', IrrigationController.create);

irrigationRoutes.get('/:id', IrrigationController.getById);

irrigationRoutes.put('/:id', IrrigationController.update);

irrigationRoutes.delete('/:id', IrrigationController.delete);
