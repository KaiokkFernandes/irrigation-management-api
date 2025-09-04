import { Router } from 'express';
import { PivotController } from '../controllers/PivotController';
import { authMiddleware } from '../middlewares/auth.middleware';

const pivotRouter = Router();
// Rotas também protegidas por autenticação do middleware
pivotRouter.use(authMiddleware);

pivotRouter.get('/', PivotController.list);
pivotRouter.post('/', PivotController.create);
pivotRouter.get('/:id', PivotController.getById);
pivotRouter.put('/:id', PivotController.update);
pivotRouter.delete('/:id', PivotController.delete);

export default pivotRouter;
