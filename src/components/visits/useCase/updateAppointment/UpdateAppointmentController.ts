import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../DecodedExpressReq';
import { UpdateAppointmentDTO } from './UpdateAppointmentDTO';
import { UpdateAppointmentUseCase } from './UpdateAppointmentUseCase';

export class UpdateAppointmentController extends BaseController {
  constructor(private useCase: UpdateAppointmentUseCase) {
    super();
  }

  public async executeImpl(req: DecodedExpressReq): Promise<any> {
    const appointmentDTO: UpdateAppointmentDTO = this.req.body;

    appointmentDTO.accountId = req.accountId;

    try {
      const updated = await this.useCase.execute(appointmentDTO);

      if (updated.isFailure) {
        return this.unprocesable(updated.error?.toString());
      }

      this.res.status(200).send({
        message: updated.getValue().message,
        appointmentId: updated.getValue().appointmentId,
      });
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
