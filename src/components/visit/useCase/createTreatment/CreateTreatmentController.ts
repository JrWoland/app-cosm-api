import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { CreateTreatmentDTO } from './CreateTreatmentDTO';
import { CreateTreatmentUseCase } from './CreateTreatmentUseCase';

export class CreateTreatmentController extends BaseController {
  constructor(private useCase: CreateTreatmentUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<void> {
    const treatmentDto: CreateTreatmentDTO = this.req.body;

    treatmentDto.accountId = req.accountId;

    try {
      const result = await this.useCase.execute(treatmentDto);

      if (result.isFailure) {
        this.unprocesable(result.error?.toString());
      } else {
        this.res.status(201).send({
          message: result.getValue().message,
          treatmentId: result.getValue().treatmentId,
        });
      }
    } catch (error) {
      this.fail(error.message);
    }
  }
}
