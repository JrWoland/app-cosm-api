import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { UpdateClientStatusDTO } from './UpdateClientStatusDTO';
import { UpdateClientStatusUseCase } from './UpdateClientStatusUseCase';

export class UpdateClientStatusController extends BaseController {
  constructor(private useCase: UpdateClientStatusUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<any> {
    const clientDto: UpdateClientStatusDTO = this.req.body;

    clientDto.accountId = req.accountId;

    try {
      const result = await this.useCase.execute(clientDto);

      if (result.isFailure) return this.unprocesable(result.error?.toString());

      const { message, clientId, newStatus, oldStatus } = result.getValue();

      return this.res.status(200).send({ message, clientId, newStatus, oldStatus });
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
