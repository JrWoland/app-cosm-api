import express from 'express';
import { createAccountController } from './useCase/createAccount';
import checkAuth from '../../api/auth/check-auth';

const accountRouter = express.Router();

accountRouter.post('/register', (req, res, next) => createAccountController.execute(req, res, next));

// accountRouter.post('/login', AccountsController.login);

// accountRouter.post('/logout', AccountsController.logout);

// accountRouter.patch('/reset-password', AccountsController.resetPassword);

// accountRouter.get('/', checkAuth, AccountsController.getAccount);

// accountRouter.patch('/update-email', checkAuth, AccountsController.updateEmail);

// accountRouter.patch('/update-password', checkAuth, AccountsController.updatePassword);

// accountRouter.delete('/', checkAuth, AccountsController.deleteAccount);

export { accountRouter };
