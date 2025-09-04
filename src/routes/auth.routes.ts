import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';


const authRouter = Router();
// Rotas públicas não precisa do middleware de autenticação
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

export default authRouter;