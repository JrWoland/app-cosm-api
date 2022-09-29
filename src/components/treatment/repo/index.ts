import { TreatmentModel } from '../../../infra/db/models/treatmentModel';
import { TreatmentRepo } from './TreatmentRepo';

const TreatmentRepository = new TreatmentRepo(TreatmentModel);

export { TreatmentRepository };
