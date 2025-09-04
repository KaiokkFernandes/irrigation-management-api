import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { irrigations, pivots } from '../database';
import type { Irrigation } from '../database';

export class IrrigationController {
  static async list(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;

    const userIrrigations = irrigations.filter((irrigation: Irrigation) => irrigation.userId === userId);

    return res.status(200).json({
      message: 'Registros de irrigação listados com sucesso!',
      irrigations: userIrrigations,
    });
  }

  static async create(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { pivotId, applicationAmount, irrigationDate } = req.body;

    if (!pivotId || !applicationAmount || !irrigationDate) {
      return res.status(400).json({
        message: 'PivotId, applicationAmount e irrigationDate são obrigatórios.',
      });
    }

    if (typeof applicationAmount !== 'number' || applicationAmount <= 0) {
      return res.status(400).json({
        message: 'ApplicationAmount deve ser um número positivo.',
      });
    }

    const pivot = pivots.find(p => p.id === pivotId && p.userId === userId);
    if (!pivot) {
      return res.status(404).json({
        message: 'Pivô não encontrado ou não pertence ao usuário.',
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (!dateRegex.test(irrigationDate)) {
      return res.status(400).json({
        message: 'IrrigationDate deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).',
      });
    }

    const newIrrigation: Irrigation = {
      id: uuidv4(),
      pivotId,
      applicationAmount,
      irrigationDate,
      userId,
    };

    irrigations.push(newIrrigation);

    return res.status(201).json({
      message: 'Registro de irrigação criado com sucesso!',
      irrigation: newIrrigation,
    });
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;

    const irrigation = irrigations.find((i: Irrigation) => i.id === id && i.userId === userId);

    if (!irrigation) {
      return res.status(404).json({
        message: 'Registro de irrigação não encontrado.',
      });
    }

    return res.status(200).json({
      message: 'Registro de irrigação encontrado!',
      irrigation,
    });
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;
    const { pivotId, applicationAmount, irrigationDate } = req.body;

    const irrigationIndex = irrigations.findIndex((i: Irrigation) => i.id === id && i.userId === userId);

    if (irrigationIndex === -1) {
      return res.status(404).json({
        message: 'Registro de irrigação não encontrado.',
      });
    }

    if (pivotId !== undefined) {
      const pivot = pivots.find(p => p.id === pivotId && p.userId === userId);
      if (!pivot) {
        return res.status(404).json({
          message: 'Pivô não encontrado ou não pertence ao usuário.',
        });
      }
      irrigations[irrigationIndex]!.pivotId = pivotId;
    }

    if (applicationAmount !== undefined) {
      if (typeof applicationAmount !== 'number' || applicationAmount <= 0) {
        return res.status(400).json({
          message: 'ApplicationAmount deve ser um número positivo.',
        });
      }
      irrigations[irrigationIndex]!.applicationAmount = applicationAmount;
    }

    if (irrigationDate !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
      if (!dateRegex.test(irrigationDate)) {
        return res.status(400).json({
          message: 'IrrigationDate deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).',
        });
      }
      irrigations[irrigationIndex]!.irrigationDate = irrigationDate;
    }

    return res.status(200).json({
      message: 'Registro de irrigação atualizado com sucesso!',
      irrigation: irrigations[irrigationIndex],
    });
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const userId = req.userId!;
    const { id } = req.params;

    const irrigationIndex = irrigations.findIndex((i: Irrigation) => i.id === id && i.userId === userId);

    if (irrigationIndex === -1) {
      return res.status(404).json({
        message: 'Registro de irrigação não encontrado.',
      });
    }

    const deletedIrrigation = irrigations.splice(irrigationIndex, 1)[0];

    return res.status(200).json({
      message: 'Registro de irrigação deletado com sucesso!',
      irrigation: deletedIrrigation,
    });
  }
}
