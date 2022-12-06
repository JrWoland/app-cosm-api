import { AppoinmentRepository, TreatmentRepository } from '../../repo';
import { UpdateAppointmentUseCase } from './UpdateAppointmentUseCase';
import { UpdateAppointmentController } from './UpdateAppointmentController';
import { TreatmentService } from '../../services/TreatmentService';

const treatmentService = new TreatmentService();

const updateAppointmentUseCase = new UpdateAppointmentUseCase(AppoinmentRepository, TreatmentRepository, treatmentService);
const updateAppointmentController = new UpdateAppointmentController(updateAppointmentUseCase);

export { updateAppointmentController };
