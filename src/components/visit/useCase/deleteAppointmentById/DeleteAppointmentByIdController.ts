import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { AccountId } from '../../../accounts/domain/AccountId';
import { AppointmentId } from '../../domain/AppointmentId';
import { AppoinmentRepository } from '../../repo';

interface ResponseDeletedAppointmentDTO {
  id: string;
  count: number;
  message: string;
}

export class DeleteAppointmentByIdController extends BaseController {
  public async executeImpl(req: DecodedExpressReq) {
    try {
      const accountId = AccountId.create(new UniqueEntityID(req.accountId));
      const appointmentId = AppointmentId.create(new UniqueEntityID(req.params.appointmentId));

      const deletedResult = await AppoinmentRepository.deleteOne(appointmentId.getValue(), accountId.getValue());

      if (deletedResult.count === 0) {
        return this.notFound(`Not found appointment with id=${deletedResult.id}.`);
      }

      return this.ok<ResponseDeletedAppointmentDTO>(this.res, { count: deletedResult.count, id: deletedResult.id, message: `Successfully deleted appointment with id=${deletedResult.id}.` });
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
