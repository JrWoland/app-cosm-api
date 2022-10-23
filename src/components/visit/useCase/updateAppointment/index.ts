import { AppoinmentRepository, TreatmentRepository } from '../../repo';
import { UpdateAppointmentUseCase } from './UpdateAppointmentUseCase';
import { UpdateAppointmentController } from './UpdateAppointmentController';

const updateAppointmentUseCase = new UpdateAppointmentUseCase(AppoinmentRepository, TreatmentRepository);
const updateAppointmentController = new UpdateAppointmentController(updateAppointmentUseCase);

export { updateAppointmentController };
