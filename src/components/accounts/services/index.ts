import { AccountRepository } from '../repo';
import { AuthService } from './AuthService';

const authService = new AuthService(AccountRepository);

export { authService };
