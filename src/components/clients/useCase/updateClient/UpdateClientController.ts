import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { UpdateClientDTO } from './UpdateClientDTO';
import { UpdateClientUseCase } from './UpdateClientUseCase';

export class UpdateClientController extends BaseController {
  constructor(private useCase: UpdateClientUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<unknown> {
    const clientDto: UpdateClientDTO = this.req.body;

    clientDto.accountId = req.accountId;

    try {
      const result = await this.useCase.execute(clientDto);

      if (result.isFailure) return this.unprocesable(result.error?.toString());

      return this.res.status(200).send({
        message: result.getValue().message,
        clientId: result.getValue().clientId,
      });
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
