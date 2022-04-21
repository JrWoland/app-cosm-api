import * as express from 'express';
import { verify } from 'jsonwebtoken';
import { authService } from '../../../components/accounts/services';
import APP_CONFIG from '../../../localSettings';

export class AuthMiddleware {
  public static async ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      if (req.headers.authorization?.startsWith('Basic')) {
        const [user, password] = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
        const basicAuth = await authService.basicAccountAuth(user, password);

        if (basicAuth.isSuccess) {
          const accountId = basicAuth.getValue().accountId.id.getValue();
          Object.defineProperty(req, 'accountId', { value: accountId });
          return next();
        } else {
          return res.status(401).json({
            message: 'Auth failed. Login first.',
          });
        }
      }

      if (req.signedCookies.access_token) {
        const token = req.signedCookies.access_token;
        const decoded = verify(token, APP_CONFIG.JWT_KEY);
        Object.defineProperty(req, 'accountId', { value: decoded.accountId });
        next();
      }
    } catch (error) {
      return res.status(401).json({
        message: 'Auth failed. Login first.',
      });
    }
  }
}
