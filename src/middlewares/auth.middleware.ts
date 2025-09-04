import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../database';
import type { User } from '../database';

export const JWT_SECRET = 'f5b4c3e2-8e2a-4d3a-9f0a-1b2c3d4e5f6g';

declare global {
  namespace Express {
    interface Request {
      userId?: string; 
      user?: User;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  const [scheme, token] = parts;

  if (!scheme || !token) {
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
      const { userId } = payload as { userId: string };

      const user = users.find((u: User) => u.id === userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }

      req.userId = userId;
      req.user = user;

      return next();
    } else {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}