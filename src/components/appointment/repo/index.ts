import { AppointmentModel } from '../../../infra/db/models/appointmentModel';
import { AppoinmentRepo } from './AppoinmentRepo';

const AppoinmentRepository = new AppoinmentRepo(AppointmentModel);

export { AppoinmentRepository };
