import express from 'express';
import { AuthMiddleware } from '../../infra/server/middleware/AuthMiddleware';
import { createAppoinmentController } from './useCase/createAppoinment';
import { updateAppointmentController } from './useCase/updateAppointment';

import { getAppointmentsListController } from './useCase/getAppointmentsList';
const appoinmentRouter = express.Router();
// appoinmentRouter.get('/appontmentId', AuthMiddleware.ensureAuthenticated, (req, res, next) => createAppoinmentController.execute(req, res, next));

appoinmentRouter.get('/list', AuthMiddleware.ensureAuthenticated, (req, res, next) => getAppointmentsListController.execute(req, res, next));

appoinmentRouter.post('/create', AuthMiddleware.ensureAuthenticated, (req, res, next) => createAppoinmentController.execute(req, res, next));

appoinmentRouter.patch('/update', AuthMiddleware.ensureAuthenticated, (req, res, next) => updateAppointmentController.execute(req, res, next));

export { appoinmentRouter };
