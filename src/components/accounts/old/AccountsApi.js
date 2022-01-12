import express from 'express';
import AccountsController from './AccountsController';
import checkAuth from '../../api/auth/check-auth';

const accountRouter = express.Router();

accountRouter.post('/login', AccountsController.login);

accountRouter.post('/logout', AccountsController.logout);

accountRouter.post('/register', AccountsController.createAccount);

accountRouter.patch('/reset-password', AccountsController.resetPassword);

// accountRouter.get('/', checkAuth, AccountsController.getAccount);

// accountRouter.patch('/update-email', checkAuth, AccountsController.updateEmail);

// accountRouter.patch('/update-password', checkAuth, AccountsController.updatePassword);

// accountRouter.delete('/', checkAuth, AccountsController.deleteAccount);

export { accountRouter };
