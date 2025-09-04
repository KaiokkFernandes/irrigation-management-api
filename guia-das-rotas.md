# Documentação das rotas

###  **PRIMEIRO: Criar um usuário (Registro)**

**Método:** `POST`  
**URL:** `http://localhost:3333/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "usuario_teste",
  "password": "senha123"
}
```

**Resposta Esperada (201 Created):**
```json
{
  "message": "Usuário criado com sucesso!",
  "user": {
    "id": "uuid-do-usuario",
    "username": "usuario_teste"
  }
}
```

---

### **SEGUNDO: Fazer login para obter o token**

**Método:** `POST`  
**URL:** `http://localhost:3333/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "usuario_teste",
  "password": "senha123"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "username": "usuario_teste"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1dWlkLWRvLXVzdWFyaW8iLCJpYXQiOjE2OTU2Nzg5MDAsImV4cCI6MTY5NTcwNzcwMH0.exemplo"
}
```

---

## **AGORA COM O TOKEN: Rotas dos Pivôs**

> **Para todas as rotas abaixo, adicione o header de autorização:**
> ```
> Authorization: Bearer SEU_TOKEN_AQUI
> ```

---

### **POST /pivots - Criar um novo pivô**

**Método:** `POST`  
**URL:** `http://localhost:3333/pivots`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
  "description": "Pivô Recém Instalado",
  "flowRate": 180.0,
  "minApplicationDepth": 6.0
}
```

**Resposta Esperada (201 Created):**
```json
{
  "message": "Pivô criado com sucesso!",
  "pivot": {
    "id": "uuid-do-pivo",
    "description": "Pivô Recém Instalado",
    "flowRate": 180.0,
    "minApplicationDepth": 6.0,
    "userId": "uuid-do-usuario"
  }
}
```

**Possíveis Erros:**
- **400 Bad Request:** Campos obrigatórios ausentes
- **401 Unauthorized:** Token inválido/ausente

---

### **GET /pivots - Listar todos os pivôs do usuário**

**Método:** `GET`  
**URL:** `http://localhost:3333/pivots`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Pivôs listados com sucesso!",
  "pivots": [
    {
      "id": "uuid-do-pivo-1",
      "description": "Pivô Recém Instalado",
      "flowRate": 180.0,
      "minApplicationDepth": 6.0,
      "userId": "uuid-do-usuario"
    }
  ]
}
```

---

### **GET /pivots/:id - Obter um pivô específico**

**Método:** `GET`  
**URL:** `http://localhost:3333/pivots/uuid-do-pivo`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Pivô encontrado!",
  "pivot": {
    "id": "uuid-do-pivo",
    "description": "Pivô Recém Instalado",
    "flowRate": 180.0,
    "minApplicationDepth": 6.0,
    "userId": "uuid-do-usuario"
  }
}
```

**Possível Erro:**
- **404 Not Found:** Pivô não encontrado

---

###  **PUT /pivots/:id - Atualizar um pivô existente**

**Método:** `PUT`  
**URL:** `http://localhost:3333/pivots/uuid-do-pivo`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON) - Campos opcionais:**
```json
{
  "description": "Pivô Atualizado",
  "flowRate": 200.0,
  "minApplicationDepth": 8.0
}
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Pivô atualizado com sucesso!",
  "pivot": {
    "id": "uuid-do-pivo",
    "description": "Pivô Atualizado",
    "flowRate": 200.0,
    "minApplicationDepth": 8.0,
    "userId": "uuid-do-usuario"
  }
}
```

---

### **DELETE /pivots/:id - Remover um pivô**

**Método:** `DELETE`  
**URL:** `http://localhost:3333/pivots/uuid-do-pivo`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Pivô deletado com sucesso!",
  "pivot": {
    "id": "uuid-do-pivo",
    "description": "Pivô Atualizado",
    "flowRate": 200.0,
    "minApplicationDepth": 8.0,
    "userId": "uuid-do-usuario"
  }
}
```

---

## **Rotas dos Registros de Irrigação**

> **Para todas as rotas abaixo, adicione o header de autorização:**
> ```
> Authorization: Bearer SEU_TOKEN_AQUI
> ```

---

### **POST /irrigations - Criar um novo registro de irrigação**

**Método:** `POST`  
**URL:** `http://localhost:3333/irrigations`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
  "pivotId": "uuid-do-pivo",
  "applicationAmount": 25.5,
  "irrigationDate": "2025-07-01T10:00:00Z"
}
```

**Resposta Esperada (201 Created):**
```json
{
  "message": "Registro de irrigação criado com sucesso!",
  "irrigation": {
    "id": "uuid-do-registro",
    "pivotId": "uuid-do-pivo",
    "applicationAmount": 25.5,
    "irrigationDate": "2025-07-01T10:00:00Z",
    "userId": "uuid-do-usuario"
  }
}
```

**Possíveis Erros:**
- **400 Bad Request:** Campos obrigatórios ausentes, applicationAmount inválido, ou formato de data incorreto
- **401 Unauthorized:** Token inválido/ausente
- **404 Not Found:** Pivô não encontrado ou não pertence ao usuário

---

### **GET /irrigations - Listar todos os registros de irrigação do usuário**

**Método:** `GET`  
**URL:** `http://localhost:3333/irrigations`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Registros de irrigação listados com sucesso!",
  "irrigations": [
    {
      "id": "uuid-do-registro-1",
      "pivotId": "uuid-do-pivo",
      "applicationAmount": 25.5,
      "irrigationDate": "2025-07-01T10:00:00Z",
      "userId": "uuid-do-usuario"
    },
    {
      "id": "uuid-do-registro-2",
      "pivotId": "uuid-do-pivo",
      "applicationAmount": 30.0,
      "irrigationDate": "2025-07-02T14:30:00Z",
      "userId": "uuid-do-usuario"
    }
  ]
}
```

---

### **GET /irrigations/:id - Obter um registro específico**

**Método:** `GET`  
**URL:** `http://localhost:3333/irrigations/uuid-do-registro`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Registro de irrigação encontrado!",
  "irrigation": {
    "id": "uuid-do-registro",
    "pivotId": "uuid-do-pivo",
    "applicationAmount": 25.5,
    "irrigationDate": "2025-07-01T10:00:00Z",
    "userId": "uuid-do-usuario"
  }
}
```

**Possível Erro:**
- **404 Not Found:** Registro não encontrado

---

### **PUT /irrigations/:id - Atualizar um registro existente**

**Método:** `PUT`  
**URL:** `http://localhost:3333/irrigations/uuid-do-registro`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON) - Campos opcionais:**
```json
{
  "pivotId": "uuid-do-outro-pivo",
  "applicationAmount": 35.0,
  "irrigationDate": "2025-07-02T15:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Registro de irrigação atualizado com sucesso!",
  "irrigation": {
    "id": "uuid-do-registro",
    "pivotId": "uuid-do-outro-pivo",
    "applicationAmount": 35.0,
    "irrigationDate": "2025-07-02T15:00:00Z",
    "userId": "uuid-do-usuario"
  }
}
```

**Possíveis Erros:**
- **400 Bad Request:** ApplicationAmount inválido ou formato de data incorreto
- **404 Not Found:** Registro não encontrado ou pivô não pertence ao usuário

---

### **DELETE /irrigations/:id - Remover um registro**

**Método:** `DELETE`  
**URL:** `http://localhost:3333/irrigations/uuid-do-registro`  
**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200 OK):**
```json
{
  "message": "Registro de irrigação deletado com sucesso!",
  "irrigation": {
    "id": "uuid-do-registro",
    "pivotId": "uuid-do-pivo",
    "applicationAmount": 25.5,
    "irrigationDate": "2025-07-01T10:00:00Z",
    "userId": "uuid-do-usuario"
  }
}
```

---

## **Configuração no Insomnia**

### Criando um Environment para o Token:
1. **Clique em "Manage Environments"**
2. **Crie um novo environment:** `Local API`
3. **Adicione a variável:**
```json
{
  "base_url": "http://localhost:3333",
  "auth_token": ""
}
```

### Usando o Environment:
- **URL:** `{{ _.base_url }}/irrigations`
- **Authorization:** `Bearer {{ _.auth_token }}`

### Atualizando o Token:
1. Após fazer login, copie o token
2. Cole em `auth_token` no environment
3. Todas as requisições usarão automaticamente

---

## **Observações Importantes sobre Irrigações**

### **Formato da Data:**
- **Obrigatório:** ISO 8601 no formato `YYYY-MM-DDTHH:mm:ssZ`
- **Exemplo válido:** `2025-07-01T10:00:00Z`
- **Exemplos inválidos:** 
  - `2025-07-01 10:00:00` (sem T e Z)
  - `01/07/2025 10:00` (formato brasileiro)
  - `2025-07-01T10:00:00` (sem Z)

### **ApplicationAmount:**
- **Tipo:** Número decimal positivo
- **Unidade:** Milímetros (mm)
- **Exemplo:** `25.5` representa 25,5mm de irrigação aplicada

### **Relacionamento com Pivôs:**
- Todo registro de irrigação deve estar associado a um pivô existente
- O pivô deve pertencer ao usuário autenticado
- Se o pivô for deletado, terá problemas com a irrigação 

