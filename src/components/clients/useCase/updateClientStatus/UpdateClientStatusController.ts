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

      return this.res.status(200).send({
        message: result.getValue().message,
        clientId: result.getValue().clientId,
        newStatus: result.getValue().newStatus,
      });
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
