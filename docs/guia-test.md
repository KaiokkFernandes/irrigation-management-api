# Guia de Configuração de Testes - Jest

## Instalação das Dependências

Execute os seguintes comandos para instalar todas as dependências de teste:

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

## Configuração do arquivo jest

### 1. Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
};
```

### 2. TypeScript Configuration
O `tsconfig.json` foi atualizado para incluir:
- Diretório de testes
- Tipos do Jest
- Configurações adequadas

### 3. Scripts NPM
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Tipos de Testes Criados

### 1. **Testes de Autenticação** (`tests/auth.test.ts`)
-  Registro de usuário
-  Login de usuário
-  Validação de campos obrigatórios
-  Tratamento de erros

### 2. **Testes de Pivôs** (`tests/pivot.test.ts`)
-  CRUD completo de pivôs
-  Autenticação obrigatória
-  Validação de dados
-  Testes de autorização

### 3. **Testes Unitários** (`tests/auth.unit.test.ts`)
-  Testes isolados dos controllers
-  Mocks de Request/Response
-  Validação de lógica de negócio

## Como Executar os Testes

### Executar todos os testes:
```bash
npm test
```

### Executar testes em modo watch:
```bash
npm run test:watch
```

### Executar testes com coverage:
```bash
npm run test:coverage
```

### Executar testes específicos:
```bash
npm test auth

npm test pivot

npm test unit
```

## Estrutura dos Testes

```
tests/
├── setup.ts              # Configuração global dos testes
├── auth.test.ts          # Testes de integração - Autenticação
├── auth.unit.test.ts     # Testes unitários - Autenticação
├── pivot.test.ts         # Testes de integração - Pivôs
└── middleware.test.ts    # Testes do middleware (futuro)
```

## Exemplos de Testes

### Teste de Integração (com SuperTest):
```typescript
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
    expect(response.body.user).toHaveProperty('username', userData.username);
  });
});
```

### Teste Unitário (com Mocks):
```typescript
test('deve criar um usuário com dados válidos', async () => {
  const req = { body: { username: 'teste', password: 'senha123' } };
  const res = createMockResponse();

  await AuthController.register(req as any, res as any);

  expect(res.statusCode).toBe(201);
  expect(res.jsonData).toHaveProperty('message', 'Usuário criado com sucesso!');
});
