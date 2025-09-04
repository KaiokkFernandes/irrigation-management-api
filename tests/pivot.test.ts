import request from 'supertest';
import { createApp } from '../src/app';
import { clearDatabase } from './setup';
import { users, pivots } from '../src/database';

const app = createApp();

describe('Pivot Controller', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    clearDatabase();

    const userData = {
      username: 'teste_usuario',
      password: 'senha123',
    };

    await request(app)
      .post('/auth/register')
      .send(userData);

    const loginResponse = await request(app)
      .post('/auth/login')
      .send(userData);

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  describe('POST /pivots', () => {
    it('deve criar um novo pivô com dados válidos', async () => {
      const pivotData = {
        description: 'Pivô Teste',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Pivô criado com sucesso!');
      expect(response.body).toHaveProperty('pivot');
      expect(response.body.pivot).toHaveProperty('id');
      expect(response.body.pivot).toHaveProperty('description', pivotData.description);
      expect(response.body.pivot).toHaveProperty('flowRate', pivotData.flowRate);
      expect(response.body.pivot).toHaveProperty('minApplicationDepth', pivotData.minApplicationDepth);
      expect(response.body.pivot).toHaveProperty('userId', userId);

      expect(pivots).toHaveLength(1);
      expect(pivots[0]?.description).toBe(pivotData.description);
    });

    it('deve retornar erro 400 quando description estiver ausente', async () => {
      const pivotData = {
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Description, flowRate e minApplicationDepth são obrigatórios.');
      expect(pivots).toHaveLength(0);
    });

    it('deve retornar erro 400 quando flowRate for inválido', async () => {
      const pivotData = {
        description: 'Pivô Teste',
        flowRate: -10,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'FlowRate deve ser um número positivo.');
      expect(pivots).toHaveLength(0);
    });

    it('deve retornar erro 401 quando não tiver token de autorização', async () => {
      const pivotData = {
        description: 'Pivô Teste',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .send(pivotData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token de autenticação não fornecido.');
      expect(pivots).toHaveLength(0);
    });
  });

  describe('GET /pivots', () => {
    beforeEach(async () => {
      const pivotData = {
        description: 'Pivô Teste 1',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData);

      await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...pivotData,
          description: 'Pivô Teste 2',
        });
    });

    it('deve listar todos os pivôs do usuário autenticado', async () => {
      const response = await request(app)
        .get('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Pivôs listados com sucesso!');
      expect(response.body).toHaveProperty('pivots');
      expect(response.body.pivots).toHaveLength(2);
      expect(response.body.pivots[0]).toHaveProperty('description', 'Pivô Teste 1');
      expect(response.body.pivots[1]).toHaveProperty('description', 'Pivô Teste 2');
    });

    it('deve retornar erro 401 quando não tiver token de autorização', async () => {
      const response = await request(app)
        .get('/pivots')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token de autenticação não fornecido.');
    });
  });

  describe('GET /pivots/:id', () => {
    let pivotId: string;

    beforeEach(async () => {
      const pivotData = {
        description: 'Pivô Teste',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData);

      pivotId = response.body.pivot.id;
    });

    it('deve retornar um pivô específico', async () => {
      const response = await request(app)
        .get(`/pivots/${pivotId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Pivô encontrado!');
      expect(response.body).toHaveProperty('pivot');
      expect(response.body.pivot).toHaveProperty('id', pivotId);
      expect(response.body.pivot).toHaveProperty('description', 'Pivô Teste');
    });

    it('deve retornar erro 404 quando pivô não existir', async () => {
      const response = await request(app)
        .get('/pivots/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Pivô não encontrado.');
    });
  });

  describe('PUT /pivots/:id', () => {
    let pivotId: string;

    beforeEach(async () => {
      const pivotData = {
        description: 'Pivô Original',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData);

      pivotId = response.body.pivot.id;
    });

    it('deve atualizar um pivô existente', async () => {
      const updateData = {
        description: 'Pivô Atualizado',
        flowRate: 200.0,
      };

      const response = await request(app)
        .put(`/pivots/${pivotId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Pivô atualizado com sucesso!');
      expect(response.body.pivot).toHaveProperty('description', 'Pivô Atualizado');
      expect(response.body.pivot).toHaveProperty('flowRate', 200.0);
      expect(response.body.pivot).toHaveProperty('minApplicationDepth', 6.0);
    });

    it('deve retornar erro 404 quando pivô não existir', async () => {
      const updateData = {
        description: 'Pivô Atualizado',
      };

      const response = await request(app)
        .put('/pivots/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Pivô não encontrado.');
    });
  });

  describe('DELETE /pivots/:id', () => {
    let pivotId: string;

    beforeEach(async () => {
      const pivotData = {
        description: 'Pivô para Deletar',
        flowRate: 180.5,
        minApplicationDepth: 6.0,
      };

      const response = await request(app)
        .post('/pivots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pivotData);

      pivotId = response.body.pivot.id;
    });

    it('deve deletar um pivô existente', async () => {
      expect(pivots).toHaveLength(1);

      const response = await request(app)
        .delete(`/pivots/${pivotId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Pivô deletado com sucesso!');
      expect(response.body.pivot).toHaveProperty('id', pivotId);
      expect(pivots).toHaveLength(0);
    });

    it('deve retornar erro 404 quando pivô não existir', async () => {
      const response = await request(app)
        .delete('/pivots/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Pivô não encontrado.');
      expect(pivots).toHaveLength(1);
    });
  });
});
