import { createApp } from './app';

const app = createApp();
const PORT: number = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});