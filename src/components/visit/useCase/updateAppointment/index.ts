import { AppoinmentRepository } from '../../repo';
import { UpdateAppointmentUseCase } from './UpdateAppointmentUseCase';
import { UpdateAppointmentController } from './UpdateAppointmentController';

const updateAppointmentUseCase = new UpdateAppointmentUseCase(AppoinmentRepository);
const updateAppointmentController = new UpdateAppointmentController(updateAppointmentUseCase);

export { updateAppointmentController };
