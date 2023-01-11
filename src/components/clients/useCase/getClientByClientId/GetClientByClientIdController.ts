import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { GetClientByClientIdUseCase } from './GetClientByClientIdUseCase';
import { GetClientDTO } from './GetClientByClientIdDTO';

export class GetClientByClientIdController extends BaseController {
  constructor(private useCase: GetClientByClientIdUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<unknown> {
    const clientDto: GetClientDTO = { accountId: '', clientId: '' };

    clientDto.accountId = req.accountId;
    clientDto.clientId = req.params.clientId;

    try {
      const result = await this.useCase.execute(clientDto);

      if (result.isFailure) return this.notFound(result.error?.toString());

      return this.ok(this.res, result.getValue());
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
