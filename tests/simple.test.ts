import { AuthController } from '../src/controllers/AuthController';
import { PivotController } from '../src/controllers/PivotController';
import { clearDatabase } from './setup';
import { users, pivots } from '../src/database';

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
    },
  };
  return res;
};

describe('API Tests - Simplified', () => {
  beforeEach(() => {
    clearDatabase();
  });

  describe('AuthController', () => {
    test('deve registrar um usuário com dados válidos', async () => {
      const req: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const res = createMockResponse();

      await AuthController.register(req as any, res as any);

      expect(res.statusCode).toBe(201);
      expect(res.jsonData).toHaveProperty('message', 'Usuário criado com sucesso!');
      expect(res.jsonData.user).toHaveProperty('username', 'teste_usuario');
      expect(users).toHaveLength(1);
    });

    test('deve fazer login com credenciais válidas', async () => {
      const registerReq: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const registerRes = createMockResponse();
      await AuthController.register(registerReq as any, registerRes as any);
      const loginReq: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const loginRes = createMockResponse();

      await AuthController.login(loginReq as any, loginRes as any);

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.jsonData).toHaveProperty('user');
      expect(loginRes.jsonData).toHaveProperty('token');
      expect(typeof loginRes.jsonData.token).toBe('string');
    });

    test('deve rejeitar login com credenciais inválidas', async () => {
      const req: MockRequest = {
        body: {
          username: 'usuario_inexistente',
          password: 'senha123',
        },
      };
      const res = createMockResponse();

      await AuthController.login(req as any, res as any);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData).toHaveProperty('message', 'Credenciais inválidas.');
    });
  });

  describe('PivotController', () => {
    let userId: string;

    beforeEach(async () => {
      const registerReq: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const registerRes = createMockResponse();
      await AuthController.register(registerReq as any, registerRes as any);
      
      userId = registerRes.jsonData.user.id;
    });

    test('deve criar um novo pivô com dados válidos', async () => {
      const req: MockRequest = {
        body: {
          description: 'Pivô Teste',
          flowRate: 180.5,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const res = createMockResponse();

      await PivotController.create(req as any, res as any);

      expect(res.statusCode).toBe(201);
      expect(res.jsonData).toHaveProperty('message', 'Pivô criado com sucesso!');
      expect(res.jsonData.pivot).toHaveProperty('description', 'Pivô Teste');
      expect(res.jsonData.pivot).toHaveProperty('userId', userId);
      expect(pivots).toHaveLength(1);
    });

    test('deve listar pivôs do usuário', async () => {
      const createReq: MockRequest = {
        body: {
          description: 'Pivô Teste',
          flowRate: 180.5,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const createRes = createMockResponse();
      await PivotController.create(createReq as any, createRes as any);
      const listReq: MockRequest = {
        userId: userId,
      };
      const listRes = createMockResponse();

      await PivotController.list(listReq as any, listRes as any);

      expect(listRes.statusCode).toBe(200);
      expect(listRes.jsonData).toHaveProperty('message', 'Pivôs listados com sucesso!');
      expect(listRes.jsonData.pivots).toHaveLength(1);
      expect(listRes.jsonData.pivots[0]).toHaveProperty('description', 'Pivô Teste');
    });

    test('deve retornar erro quando campos obrigatórios estiverem ausentes', async () => {
      const req: MockRequest = {
        body: {
          flowRate: 180.5,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const res = createMockResponse();

      await PivotController.create(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'Description, flowRate e minApplicationDepth são obrigatórios.');
      expect(pivots).toHaveLength(0);
    });

    test('deve retornar erro quando flowRate for inválido', async () => {
      const req: MockRequest = {
        body: {
          description: 'Pivô Teste',
          flowRate: -10,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const res = createMockResponse();

      await PivotController.create(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'FlowRate deve ser um número positivo.');
      expect(pivots).toHaveLength(0);
    });

    test('deve atualizar um pivô existente', async () => {
      const createReq: MockRequest = {
        body: {
          description: 'Pivô Original',
          flowRate: 180.5,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const createRes = createMockResponse();
      await PivotController.create(createReq as any, createRes as any);

      const pivotId = createRes.jsonData.pivot.id;
      const updateReq: MockRequest = {
        body: {
          description: 'Pivô Atualizado',
          flowRate: 200.0,
        },
        params: { id: pivotId },
        userId: userId,
      };
      const updateRes = createMockResponse();

      await PivotController.update(updateReq as any, updateRes as any);

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.jsonData).toHaveProperty('message', 'Pivô atualizado com sucesso!');
      expect(updateRes.jsonData.pivot).toHaveProperty('description', 'Pivô Atualizado');
      expect(updateRes.jsonData.pivot).toHaveProperty('flowRate', 200.0);
    });

    test('deve deletar um pivô existente', async () => {
      const createReq: MockRequest = {
        body: {
          description: 'Pivô para Deletar',
          flowRate: 180.5,
          minApplicationDepth: 6.0,
        },
        userId: userId,
      };
      const createRes = createMockResponse();
      await PivotController.create(createReq as any, createRes as any);

      expect(pivots).toHaveLength(1);

      const pivotId = createRes.jsonData.pivot.id;
      const deleteReq: MockRequest = {
        params: { id: pivotId },
        userId: userId,
      };
      const deleteRes = createMockResponse();

      await PivotController.delete(deleteReq as any, deleteRes as any);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.jsonData).toHaveProperty('message', 'Pivô deletado com sucesso!');
      expect(pivots).toHaveLength(0);
    });

    test('deve retornar erro 404 quando pivô não existir', async () => {
      const req: MockRequest = {
        params: { id: 'id-inexistente' },
        userId: userId,
      };
      const res = createMockResponse();

      await PivotController.getById(req as any, res as any);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toHaveProperty('message', 'Pivô não encontrado.');
    });
  });
});
