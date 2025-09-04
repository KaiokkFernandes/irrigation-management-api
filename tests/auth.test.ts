import request from 'supertest';
import { createApp } from '../src/app';
import { clearDatabase } from './setup';
import { users } from '../src/database';

const app = createApp();

describe('Auth Controller', () => {
  beforeEach(() => {
    clearDatabase();
  });

  describe('POST /auth/register', () => {
    it('deve criar um novo usuário com dados válidos', async () => {
      const userData = {
        username: 'teste_usuario',
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso!');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).not.toHaveProperty('passwordHash');

      expect(users).toHaveLength(1);
      expect(users[0]?.username).toBe(userData.username);
    });

    it('deve retornar erro 400 quando username estiver ausente', async () => {
      const userData = {
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username e password são obrigatórios.');
      expect(users).toHaveLength(0);
    });

    it('deve retornar erro 400 quando password estiver ausente', async () => {
      const userData = {
        username: 'teste_usuario',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username e password são obrigatórios.');
      expect(users).toHaveLength(0);
    });

    it('deve retornar erro 400 quando tentar registrar usuário já existente', async () => {
      const userData = {
        username: 'teste_usuario',
        password: 'senha123',
      };

      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Usuário já cadastrado.');
      expect(users).toHaveLength(1); 
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          username: 'teste_usuario',
          password: 'senha123',
        });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        username: 'teste_usuario',
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', loginData.username);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('deve retornar erro 400 quando username estiver ausente', async () => {
      const loginData = {
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username e password são obrigatórios.');
    });

    it('deve retornar erro 400 quando password estiver ausente', async () => {
      const loginData = {
        username: 'teste_usuario',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username e password são obrigatórios.');
    });

    it('deve retornar erro 401 quando usuário não existir', async () => {
      const loginData = {
        username: 'usuario_inexistente',
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Credenciais inválidas.');
    });

    it('deve retornar erro 401 quando senha estiver incorreta', async () => {
      const loginData = {
        username: 'teste_usuario',
        password: 'senha_errada',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Credenciais inválidas.');
    });
  });
});
