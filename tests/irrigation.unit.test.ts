import { IrrigationController } from '../src/controllers/IrrigationController';
import { clearDatabase } from './setup';
import { users, pivots, irrigations } from '../src/database';
import { v4 as uuidv4 } from 'uuid';

interface MockRequest {
  body?: any;
  params?: any;
  userId?: string;
  user?: any;
}

interface MockResponse {
  statusCode?: number;
  jsonData?: any;
  status: (code: number) => MockResponse;
  json: (data: any) => MockResponse;
}

const createMockResponse = (): MockResponse => {
  const res: MockResponse = {
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    json: (data: any) => {
      res.jsonData = data;
      return res;
    }
  };
  return res;
};

describe('IrrigationController - Testes Unitários', () => {
  let userId: string;
  let pivotId: string;

  beforeEach(() => {
    clearDatabase();
    
    userId = uuidv4();
    users.push({
      id: userId,
      username: 'teste_usuario',
      passwordHash: 'hash_senha'
    });

    pivotId = uuidv4();
    pivots.push({
      id: pivotId,
      description: 'Pivô Teste',
      flowRate: 180.5,
      minApplicationDepth: 6.0,
      userId: userId
    });
  });

  describe('create', () => {
    it('deve criar registro de irrigação com dados válidos', async () => {
      const req: MockRequest = {
        userId: userId,
        body: {
          pivotId: pivotId,
          applicationAmount: 25.5,
          irrigationDate: '2025-07-01T10:00:00Z'
        }
      };
      const res = createMockResponse();

      await IrrigationController.create(req as any, res as any);

      expect(res.statusCode).toBe(201);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação criado com sucesso!');
      expect(res.jsonData).toHaveProperty('irrigation');
      expect(res.jsonData.irrigation).toHaveProperty('pivotId', pivotId);
      expect(res.jsonData.irrigation).toHaveProperty('applicationAmount', 25.5);
      expect(res.jsonData.irrigation).toHaveProperty('userId', userId);
      expect(irrigations).toHaveLength(1);
    });

    it('deve retornar erro quando campos obrigatórios estiverem ausentes', async () => {
      const req: MockRequest = {
        userId: userId,
        body: {
          applicationAmount: 25.5,
          irrigationDate: '2025-07-01T10:00:00Z'
        }
      };
      const res = createMockResponse();

      await IrrigationController.create(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'PivotId, applicationAmount e irrigationDate são obrigatórios.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro quando applicationAmount for negativo', async () => {
      const req: MockRequest = {
        userId: userId,
        body: {
          pivotId: pivotId,
          applicationAmount: -10,
          irrigationDate: '2025-07-01T10:00:00Z'
        }
      };
      const res = createMockResponse();

      await IrrigationController.create(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'ApplicationAmount deve ser um número positivo.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro quando pivô não existir', async () => {
      const req: MockRequest = {
        userId: userId,
        body: {
          pivotId: 'id-inexistente',
          applicationAmount: 25.5,
          irrigationDate: '2025-07-01T10:00:00Z'
        }
      };
      const res = createMockResponse();

      await IrrigationController.create(req as any, res as any);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toHaveProperty('message', 'Pivô não encontrado ou não pertence ao usuário.');
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro quando formato da data for inválido', async () => {
      const req: MockRequest = {
        userId: userId,
        body: {
          pivotId: pivotId,
          applicationAmount: 25.5,
          irrigationDate: '2025-07-01 10:00:00'
        }
      };
      const res = createMockResponse();

      await IrrigationController.create(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'IrrigationDate deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).');
      expect(irrigations).toHaveLength(0);
    });
  });

  describe('list', () => {
    beforeEach(() => {
      irrigations.push(
        {
          id: uuidv4(),
          pivotId: pivotId,
          applicationAmount: 25.5,
          irrigationDate: '2025-07-01T10:00:00Z',
          userId: userId
        },
        {
          id: uuidv4(),
          pivotId: pivotId,
          applicationAmount: 30.0,
          irrigationDate: '2025-07-02T14:30:00Z',
          userId: userId
        }
      );
    });

    it('deve listar registros de irrigação do usuário', async () => {
      const req: MockRequest = {
        userId: userId
      };
      const res = createMockResponse();

      await IrrigationController.list(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('message', 'Registros de irrigação listados com sucesso!');
      expect(res.jsonData).toHaveProperty('irrigations');
      expect(res.jsonData.irrigations).toHaveLength(2);
    });

    it('deve retornar lista vazia quando usuário não tiver registros', async () => {
      clearDatabase();
      
      const req: MockRequest = {
        userId: 'outro-usuario'
      };
      const res = createMockResponse();

      await IrrigationController.list(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('irrigations');
      expect(res.jsonData.irrigations).toHaveLength(0);
    });
  });

  describe('getById', () => {
    let irrigationId: string;

    beforeEach(() => {
      irrigationId = uuidv4();
      irrigations.push({
        id: irrigationId,
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
        userId: userId
      });
    });

    it('deve retornar registro específico quando existir', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: irrigationId }
      };
      const res = createMockResponse();

      await IrrigationController.getById(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação encontrado!');
      expect(res.jsonData).toHaveProperty('irrigation');
      expect(res.jsonData.irrigation).toHaveProperty('id', irrigationId);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: 'id-inexistente' }
      };
      const res = createMockResponse();

      await IrrigationController.getById(req as any, res as any);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação não encontrado.');
    });
  });

  describe('update', () => {
    let irrigationId: string;

    beforeEach(() => {
      irrigationId = uuidv4();
      irrigations.push({
        id: irrigationId,
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
        userId: userId
      });
    });

    it('deve atualizar registro existente', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: irrigationId },
        body: {
          applicationAmount: 35.0,
          irrigationDate: '2025-07-02T15:00:00Z'
        }
      };
      const res = createMockResponse();

      await IrrigationController.update(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação atualizado com sucesso!');
      expect(res.jsonData.irrigation).toHaveProperty('applicationAmount', 35.0);
      expect(res.jsonData.irrigation).toHaveProperty('irrigationDate', '2025-07-02T15:00:00Z');
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: 'id-inexistente' },
        body: { applicationAmount: 35.0 }
      };
      const res = createMockResponse();

      await IrrigationController.update(req as any, res as any);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação não encontrado.');
    });

    it('deve retornar erro quando applicationAmount for inválido', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: irrigationId },
        body: { applicationAmount: -5 }
      };
      const res = createMockResponse();

      await IrrigationController.update(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'ApplicationAmount deve ser um número positivo.');
    });
  });

  describe('delete', () => {
    let irrigationId: string;

    beforeEach(() => {
      irrigationId = uuidv4();
      irrigations.push({
        id: irrigationId,
        pivotId: pivotId,
        applicationAmount: 25.5,
        irrigationDate: '2025-07-01T10:00:00Z',
        userId: userId
      });
    });

    it('deve deletar registro existente', async () => {
      expect(irrigations).toHaveLength(1);

      const req: MockRequest = {
        userId: userId,
        params: { id: irrigationId }
      };
      const res = createMockResponse();

      await IrrigationController.delete(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação deletado com sucesso!');
      expect(res.jsonData.irrigation).toHaveProperty('id', irrigationId);
      expect(irrigations).toHaveLength(0);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      const req: MockRequest = {
        userId: userId,
        params: { id: 'id-inexistente' }
      };
      const res = createMockResponse();

      await IrrigationController.delete(req as any, res as any);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toHaveProperty('message', 'Registro de irrigação não encontrado.');
      expect(irrigations).toHaveLength(1);
    });
  });
});
