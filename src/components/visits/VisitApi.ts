import express from 'express';
import { AuthMiddleware } from '../../infra/server/middleware/AuthMiddleware';
import { createAppoinmentController } from './useCase/createAppoinment';
import { updateAppointmentController } from './useCase/updateAppointment';

const appoinmentRouter = express.Router();

appoinmentRouter.post('/create', AuthMiddleware.ensureAuthenticated, (req, res, next) => createAppoinmentController.execute(req, res, next));
appoinmentRouter.patch('/update', AuthMiddleware.ensureAuthenticated, (req, res, next) => updateAppointmentController.execute(req, res, next));

export { appoinmentRouter };
