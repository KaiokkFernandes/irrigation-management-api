import express from 'express';
import type { Request, Response } from 'express';
import authRouter from './routes/auth.routes';
import pivotRouter from './routes/pivot.routes';

const app = express();

const PORT: number = Number(process.env.PORT) || 3333;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Api funcionando' });
});

app.use('/auth', authRouter);
app.use('/pivots', pivotRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});