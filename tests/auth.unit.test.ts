import { AuthController } from '../src/controllers/AuthController';
import { clearDatabase } from './setup';
import { users } from '../src/database';

interface MockRequest {
  body: any;
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

describe('AuthController Unit Tests', () => {
  beforeEach(() => {
    clearDatabase();
  });

  describe('register', () => {
    test('deve criar um usuário com dados válidos', async () => {
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
      expect(res.jsonData).toHaveProperty('user');
      expect(res.jsonData.user).toHaveProperty('username', 'teste_usuario');
      expect(users).toHaveLength(1);
    });

    test('deve retornar erro quando username estiver ausente', async () => {
      const req: MockRequest = {
        body: {
          password: 'senha123',
        },
      };
      const res = createMockResponse();

      await AuthController.register(req as any, res as any);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toHaveProperty('message', 'Username e password são obrigatórios.');
      expect(users).toHaveLength(0);
    });

    test('deve retornar erro quando usuário já existir', async () => {
      const req1: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const res1 = createMockResponse();
      await AuthController.register(req1 as any, res1 as any);

      const req2: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha456',
        },
      };
      const res2 = createMockResponse();
      await AuthController.register(req2 as any, res2 as any);

      expect(res2.statusCode).toBe(400);
      expect(res2.jsonData).toHaveProperty('message', 'Usuário já cadastrado.');
      expect(users).toHaveLength(1);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const req: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const res = createMockResponse();
      await AuthController.register(req as any, res as any);
    });

    test('deve fazer login com credenciais válidas', async () => {
      const req: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha123',
        },
      };
      const res = createMockResponse();

      await AuthController.login(req as any, res as any);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('user');
      expect(res.jsonData).toHaveProperty('token');
      expect(res.jsonData.user).toHaveProperty('username', 'teste_usuario');
      expect(typeof res.jsonData.token).toBe('string');
    });

    test('deve retornar erro com credenciais inválidas', async () => {
      const req: MockRequest = {
        body: {
          username: 'teste_usuario',
          password: 'senha_errada',
        },
      };
      const res = createMockResponse();

      await AuthController.login(req as any, res as any);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData).toHaveProperty('message', 'Credenciais inválidas.');
    });

    test('deve retornar erro quando usuário não existir', async () => {
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
});
