import { AppointmentModel } from '../../../infra/db/models/appointmentModel';
import { TreatmentModel } from '../../../infra/db/models/treatmentModel';

import { AppoinmentRepo } from './AppoinmentRepo';
import { TreatmentRepo } from './TreatmentRepo';

const AppoinmentRepository = new AppoinmentRepo(AppointmentModel);
const TreatmentRepository = new TreatmentRepo(TreatmentModel);
export { AppoinmentRepository, TreatmentRepository };
