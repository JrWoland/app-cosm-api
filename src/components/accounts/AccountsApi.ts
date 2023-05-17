import express from 'express';
import { createAccountController } from './useCase/createAccount';
import { loginAccountController } from './useCase/loginToAccount';
import { logoutAccountController } from './useCase/logoutAccount';

const accountRouter = express.Router();

accountRouter.post('/register', (req, res, next) => createAccountController.execute(req, res, next));

accountRouter.post('/login', (req, res, next) => loginAccountController.execute(req, res, next));

accountRouter.post('/logout', (req, res, next) => logoutAccountController.execute(req, res, next));

// accountRouter.delete('/', checkAuth, AccountsController.deleteAccount);

// accountRouter.patch('/reset-password', AccountsController.resetPassword);

// accountRouter.get('/', checkAuth, AccountsController.getAccount);

// accountRouter.patch('/update-email', checkAuth, AccountsController.updateEmail);

// accountRouter.patch('/update-password', checkAuth, AccountsController.updatePassword);

export { accountRouter };
