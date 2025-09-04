import request from 'supertest';
import { createApp } from '../src/app';
import { clearDatabase } from './setup';
import { users, pivots, irrigations } from '../src/database';

const app = createApp();

describe('Irrigation Controller', () => {
  let authToken: string;
  let userId: string;
  let pivotId: string;

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

    const pivotData = {
      description: 'Pivô Teste',
      flowRate: 180.5,
      minApplicationDepth: 6.0,
    };

    const pivotResponse = await request(app)
      .post('/pivots')
      .set('Authorization', `Bearer ${authToken}`)
      .send(pivotData);

    pivotId = pivotResponse.body.pivot.id;
  });

  describe('POST /irrigations', () => {
    it('deve criar um novo registro de irrigação com dados válidos', async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação criado com sucesso!');
      expect(response.body).toHaveProperty('irrigation');
      expect(response.body.irrigation).toHaveProperty('id');
      expect(response.body.irrigation).toHaveProperty('pivotId', pivotId);
      expect(response.body.irrigation).toHaveProperty('applicationAmount', 25.5);
      expect(response.body.irrigation).toHaveProperty('irrigationDate', '2025-07-01T10:00:00Z');
      expect(response.body.irrigation).toHaveProperty('userId', userId);

      expect(irrigations).toHaveLength(1);
      expect(irrigations[0]?.applicationAmount).toBe(25.5);
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem ausentes', async () => {
      const irrigationData = {
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'PivotId, applicationAmount e irrigationDate são obrigatórios.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 400 quando applicationAmount for inválido', async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: -10,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'ApplicationAmount deve ser um número positivo.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 400 quando formato da data for inválido', async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01 10:00:00',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'IrrigationDate deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 404 quando pivô não existir', async () => {
      const irrigationData = {
        pivotId: 'id-inexistente',
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Pivô não encontrado ou não pertence ao usuário.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 401 quando não tiver token de autorização', async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .send(irrigationData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token de autenticação não fornecido.');
      expect(irrigations).toHaveLength(0);
    });
  });

  describe('GET /irrigations', () => {
    beforeEach(async () => {
      const irrigationData1 = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const irrigationData2 = {
        pivotId: pivotId,
        applicationAmount: 30.0,
        irrigationDate: '2025-07-02T14:30:00Z',
      };

      await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData1);

      await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData2);
    });

    it('deve listar todos os registros de irrigação do usuário autenticado', async () => {
      const response = await request(app)
        .get('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Registros de irrigação listados com sucesso!');
      expect(response.body).toHaveProperty('irrigations');
      expect(response.body.irrigations).toHaveLength(2);
      expect(response.body.irrigations[0]).toHaveProperty('applicationAmount', 25.5);
      expect(response.body.irrigations[1]).toHaveProperty('applicationAmount', 30.0);
    });

    it('deve retornar erro 401 quando não tiver token de autorização', async () => {
      const response = await request(app)
        .get('/irrigations')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token de autenticação não fornecido.');
    });
  });

  describe('GET /irrigations/:id', () => {
    let irrigationId: string;

    beforeEach(async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData);

      irrigationId = response.body.irrigation.id;
    });

    it('deve retornar um registro de irrigação específico', async () => {
      const response = await request(app)
        .get(`/irrigations/${irrigationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação encontrado!');
      expect(response.body).toHaveProperty('irrigation');
      expect(response.body.irrigation).toHaveProperty('id', irrigationId);
      expect(response.body.irrigation).toHaveProperty('applicationAmount', 25.5);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const response = await request(app)
        .get('/irrigations/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação não encontrado.');
    });
  });

  describe('PUT /irrigations/:id', () => {
    let irrigationId: string;

    beforeEach(async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData);

      irrigationId = response.body.irrigation.id;
    });

    it('deve atualizar um registro de irrigação existente', async () => {
      const updateData = {
        applicationAmount: 35.0,
        irrigationDate: '2025-07-02T15:00:00Z',
      };

      const response = await request(app)
        .put(`/irrigations/${irrigationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação atualizado com sucesso!');
      expect(response.body.irrigation).toHaveProperty('applicationAmount', 35.0);
      expect(response.body.irrigation).toHaveProperty('irrigationDate', '2025-07-02T15:00:00Z');
      expect(response.body.irrigation).toHaveProperty('pivotId', pivotId);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const updateData = {
        applicationAmount: 35.0,
      };

      const response = await request(app)
        .put('/irrigations/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação não encontrado.');
    });

    it('deve retornar erro 400 quando applicationAmount for inválido', async () => {
      const updateData = {
        applicationAmount: -5,
      };

      const response = await request(app)
        .put(`/irrigations/${irrigationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'ApplicationAmount deve ser um número positivo.');
    });
  });

  describe('DELETE /irrigations/:id', () => {
    let irrigationId: string;

    beforeEach(async () => {
      const irrigationData = {
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
      };

      const response = await request(app)
        .post('/irrigations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(irrigationData);

      irrigationId = response.body.irrigation.id;
    });

    it('deve deletar um registro de irrigação existente', async () => {
      expect(irrigations).toHaveLength(1);

      const response = await request(app)
        .delete(`/irrigations/${irrigationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação deletado com sucesso!');
      expect(response.body.irrigation).toHaveProperty('id', irrigationId);
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const response = await request(app)
        .delete('/irrigations/id-inexistente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Registro de irrigação não encontrado.');
      expect(irrigations).toHaveLength(1);
    });
  });
});
