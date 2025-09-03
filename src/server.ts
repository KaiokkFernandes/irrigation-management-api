const express = require('express');
import type { Request, Response } from 'express';

const app = express();

const PORT: number = Number(process.env.PORT) || 3333;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API de Gerenciamento de Irrigação no ar! (com TypeScript)' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});