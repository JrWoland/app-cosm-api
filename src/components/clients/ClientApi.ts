import express from 'express';
import { AuthMiddleware } from '../../infra/server/middleware/AuthMiddleware';
import { getClientByClientId } from './useCase/getClientByClientId';
import { createClientController } from './useCase/createClient';
import { updateClientController } from './useCase/updateClient';
import { updateClientStatusController } from './useCase/updateClientStatus';

const clientRouter = express.Router();

clientRouter.get('/:clientId', AuthMiddleware.ensureAuthenticated, (req, res, next) => getClientByClientId.execute(req, res, next));
clientRouter.post('/create', AuthMiddleware.ensureAuthenticated, (req, res, next) => createClientController.execute(req, res, next));
clientRouter.patch('/update', AuthMiddleware.ensureAuthenticated, (req, res, next) => updateClientController.execute(req, res, next));
clientRouter.patch('/update/status', AuthMiddleware.ensureAuthenticated, (req, res, next) => updateClientStatusController.execute(req, res, next));

export { clientRouter };
