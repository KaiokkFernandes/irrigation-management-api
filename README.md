# 🌾 Irrigation Management API

> **Sistema de Gerenciamento de Irrigação** - API RESTful para controle de pivôs e registros de irrigação

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![Jest](https://img.shields.io/badge/Jest-29.7.0-red)

## Sobre o Projeto

A **Irrigation Management API** é uma aplicação backend desenvolvida em **Node.js** com **TypeScript** que oferece um sistema completo para gerenciamento de irrigação agrícola. A API segue os padrões **RESTful** e inclui funcionalidades de autenticação, gestão de pivôs de irrigação e registro de aplicações de água.

### Funcionalidades Principais

- **Autenticação JWT**: Sistema seguro de login e registro de usuários
- **Gestão de Pivôs**: CRUD completo para equipamentos de irrigação
- **Registros de Irrigação**: Controle detalhado das aplicações de água
- **Segurança**: Middleware de autenticação e isolamento de dados por usuário
- **Testes Automatizados**: Cobertura completa com Jest (unitários e integração)

---

## Tecnologias Utilizadas

### **Backend**
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem tipada
- **[Express.js](https://expressjs.com/)** - Framework web minimalista
- **[JWT](https://jwt.io/)** - Autenticação via JSON Web Tokens
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[UUID](https://www.npmjs.com/package/uuid)** - Geração de identificadores únicos

### **Testes**
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[SuperTest](https://www.npmjs.com/package/supertest)** - Testes de API HTTP
- **[ts-jest](https://www.npmjs.com/package/ts-jest)** - Jest com suporte ao TypeScript

### **Desenvolvimento**
- **[ts-node-dev](https://www.npmjs.com/package/ts-node-dev)** - Hot reload para desenvolvimento
- **[Nodemon](https://nodemon.io/)** - Monitor de arquivos

---

## Estrutura do Projeto

```
irrigation-management-api/
├── src/                          # Código fonte
│   ├── controllers/              # Controladores da aplicação
│   │   ├── AuthController.ts     # Autenticação
│   │   ├── PivotController.ts    # Gestão de pivôs
│   │   └── IrrigationController.ts # Registros de irrigação
│   ├── routes/                   # Definição das rotas
│   │   ├── auth.routes.ts        # Rotas de autenticação
│   │   ├── pivot.routes.ts       # Rotas de pivôs
│   │   └── irrigation.routes.ts  # Rotas de irrigação
│   ├── middlewares/              # Middlewares customizados
│   │   └── auth.middleware.ts    # Middleware de autenticação
│   ├── types/                    # Definições de tipos
│   │   └── express.d.ts          # Extensões do Express
│   ├── docs/                     # Documentação
│   │   ├── guia-das-rotas.md     # Guia completo das rotas da API
│   │   └── guia-test.md          # Guia de testes
│   ├── database.ts               # Simulação de banco de dados
│   ├── app.ts                    # Configuração do Express
│   └── server.ts                 # Servidor principal
├── tests/                        # Testes automatizados
│   ├── auth.test.ts              # Testes de autenticação
│   ├── pivot.test.ts             # Testes de pivôs
│   ├── irrigation.test.ts        # Testes de irrigação
│   ├── auth.unit.test.ts         # Testes unitários de auth
│   ├── irrigation.unit.test.ts   # Testes unitários de irrigação
│   ├── simple.test.ts            # Testes simplificados
│   └── setup.ts                  # Configuração dos testes
├── jest.config.js                # Configuração do Jest
├── tsconfig.json                 # Configuração do TypeScript
└── package.json                  # Dependências e scripts
```

---

## Configuração e Instalação

### **Pré-requisitos**

- **Node.js** versão 18 ou superior
- **npm** ou **yarn**
- **Git**

### **1. Clone o Repositório**

```bash
git clone https://github.com/KaiokkFernandes/irrigation-management-api.git
cd irrigation-management-api
```

### **2. Instale as Dependências**

```bash
# Com npm
npm install

# Ou com yarn
yarn install
```

### **3. Configuração do Ambiente**

Crie um arquivo `.env` na raiz do projeto (opcional - a aplicação funciona com valores padrão):

```env
PORT=3333
JWT_SECRET=f5b4c3e2-8e2a-4d3a-9f0a-1b2c3d4e5f6g
```

---

## Como Executar

### **Modo Desenvolvimento**

```bash
npm run dev

yarn dev
```

O servidor estará disponível em: **http://localhost:3333**

### **Modo Produção**

```bash
# Compila o TypeScript
npm run build

# Inicia o servidor compilado
npm start
```

### **Verificar se está Funcionando**

```bash
# Teste básico da API
curl http://localhost:3333

# Resposta esperada:
# {"message":"Api funcionando"}
```

---

## Executando os Testes

### **Todos os Testes**

```bash
# Executa todos os testes
npm test

# Ou com yarn
yarn test
```

### **Testes Específicos**

```bash
# Testes de autenticação
npm test auth

# Testes de pivôs
npm test pivot

# Testes de irrigação
npm test irrigation
```

### **Testes com Cobertura**

```bash
# Gera relatório de cobertura
npm run test:coverage

# Abre o relatório no navegador
# coverage/lcov-report/index.html
```

### **Modo Watch (Desenvolvimento)**

```bash
# Executa testes automaticamente ao salvar arquivos
npm run test:watch
```