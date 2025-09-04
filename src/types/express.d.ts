// Extensões para os tipos do Express
import type { User } from '../database';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User;
    }
  }
}
