import { BaseController } from '../../../../core/infra/BaseController';

export class LogoutAccountController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(): Promise<any> {
    this.res.clearCookie('access_token');

    return this.ok(this.res, { message: 'logged out' });
  }
}
