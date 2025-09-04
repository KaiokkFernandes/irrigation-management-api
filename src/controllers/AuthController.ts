// src/controllers/AuthController.ts
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../database.js';
import { users } from '../database.js';

const JWT_SECRET = 'seu-segredo-super-secreto';

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username e password são obrigatórios.' });
    }

    const userExists = users.find((user: User) => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const newUser: User = {
      id: uuidv4(),
      username,
      passwordHash,
    };

    users.push(newUser);

    return res.status(201).json({ message: 'Usuário criado com sucesso!', user: { id: newUser.id, username: newUser.username } });
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username e password são obrigatórios.' });
    }

    const user = users.find((user: User) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });

    return res.status(200).json({
      user: { id: user.id, username: user.username },
      token,
    });
  }
}