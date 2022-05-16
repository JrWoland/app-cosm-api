import express from 'express';
import { AuthMiddleware } from '../../infra/server/middleware/AuthMiddleware';
import { createClientController } from './useCase/createClient';

const clientRouter = express.Router();

clientRouter.post('/create', AuthMiddleware.ensureAuthenticated, (req, res, next) => createClientController.execute(req, res, next));

export { clientRouter };
