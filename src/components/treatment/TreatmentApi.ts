import express from 'express';
import { AuthMiddleware } from '../../infra/server/middleware/AuthMiddleware';
import { createTreatmentController } from './useCase/createTreatment';
import { updateTreatmentController } from './useCase/updateTreatment';

const treatmentRouter = express.Router();

treatmentRouter.post('/create', AuthMiddleware.ensureAuthenticated, (req, res, next) => createTreatmentController.execute(req, res, next));
treatmentRouter.patch('/update', AuthMiddleware.ensureAuthenticated, (req, res, next) => updateTreatmentController.execute(req, res, next));

export { treatmentRouter };
