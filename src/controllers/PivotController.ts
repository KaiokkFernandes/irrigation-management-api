import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pivots } from '../database';
import type { Pivot } from '../database';

export class PivotController {
  static async list(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;

    const userPivots = pivots.filter((pivot: Pivot) => pivot.userId === userId);

    return res.status(200).json({
      message: 'Pivôs listados com sucesso!',
      pivots: userPivots,
    });
  }

  static async create(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { description, flowRate, minApplicationDepth } = req.body;

    if (!description || !flowRate || !minApplicationDepth) {
      return res.status(400).json({
        message: 'Description, flowRate e minApplicationDepth são obrigatórios.',
      });
    }

    if (typeof flowRate !== 'number' || flowRate <= 0) {
      return res.status(400).json({
        message: 'FlowRate deve ser um número positivo.',
      });
    }

    if (typeof minApplicationDepth !== 'number' || minApplicationDepth <= 0) {
      return res.status(400).json({
        message: 'MinApplicationDepth deve ser um número positivo.',
      });
    }

    const newPivot: Pivot = {
      id: uuidv4(),
      description,
      flowRate,
      minApplicationDepth,
      userId,
    };

    pivots.push(newPivot);

    return res.status(201).json({
      message: 'Pivô criado com sucesso!',
      pivot: newPivot,
    });
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;

    const pivot = pivots.find((p: Pivot) => p.id === id && p.userId === userId);

    if (!pivot) {
      return res.status(404).json({
        message: 'Pivô não encontrado.',
      });
    }

    return res.status(200).json({
      message: 'Pivô encontrado!',
      pivot,
    });
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;
    const { description, flowRate, minApplicationDepth } = req.body;

    const pivotIndex = pivots.findIndex((p: Pivot) => p.id === id && p.userId === userId);

    if (pivotIndex === -1) {
      return res.status(404).json({
        message: 'Pivô não encontrado.',
      });
    }

    if (description !== undefined) {
      pivots[pivotIndex]!.description = description;
    }
    if (flowRate !== undefined) {
      if (typeof flowRate !== 'number' || flowRate <= 0) {
        return res.status(400).json({
          message: 'FlowRate deve ser um número positivo.',
        });
      }
      pivots[pivotIndex]!.flowRate = flowRate;
    }
    if (minApplicationDepth !== undefined) {
      if (typeof minApplicationDepth !== 'number' || minApplicationDepth <= 0) {
        return res.status(400).json({
          message: 'MinApplicationDepth deve ser um número positivo.',
        });
      }
      pivots[pivotIndex]!.minApplicationDepth = minApplicationDepth;
    }

    return res.status(200).json({
      message: 'Pivô atualizado com sucesso!',
      pivot: pivots[pivotIndex],
    });
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;

    const pivotIndex = pivots.findIndex((p: Pivot) => p.id === id && p.userId === userId);

    if (pivotIndex === -1) {
      return res.status(404).json({
        message: 'Pivô não encontrado.',
      });
    }

    const deletedPivot = pivots.splice(pivotIndex, 1)[0];

    return res.status(200).json({
      message: 'Pivô deletado com sucesso!',
      pivot: deletedPivot,
    });
  }
}
