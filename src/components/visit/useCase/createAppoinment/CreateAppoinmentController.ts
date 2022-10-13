import { BaseController } from '../../../../core/infra/BaseController';
import { CreateAppoinmentDTO } from './CreateAppoinmentDTO';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';

export class CreateAppoinmentController extends BaseController {
  constructor(private useCase: CreateAppoinmentUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<any> {
    const newAppoinmentDTO: CreateAppoinmentDTO = this.req.body;

    newAppoinmentDTO.accountId = req.accountId;

    try {
      const result = await this.useCase.execute(newAppoinmentDTO);

      if (result.isSuccess) {
        this.res.status(201).send({
          message: result.getValue().message,
          appointmentId: result.getValue().appointmentId,
        });
      } else {
        this.unprocesable(result.error?.toString());
      }
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
