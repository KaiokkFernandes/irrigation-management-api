import { v4 as uuidv4 } from 'uuid';

//INTERFACES Definição dos Tipos

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface Pivot {
  id: string;
  description: string;
  flowRate: number;
  minApplicationDepth: number;
  userId: string;
}

export interface Irrigation {
  id: string;
  pivotId: string;
  applicationAmount: number;
  irrigationDate: string;
  userId: string;
}


export const users: User[] = [];
export const pivots: Pivot[] = [];
export const irrigations: Irrigation[] = [];