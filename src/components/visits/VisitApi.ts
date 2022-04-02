import express from 'express';
import checkAuth from '../../api/auth/check-auth';
import { createAppoinmentController } from './useCase/createAppoinment';

const appoinmentRouter = express.Router();

appoinmentRouter.post('/create', checkAuth, (req, res, next) => createAppoinmentController.execute(req, res, next));

export { appoinmentRouter };
