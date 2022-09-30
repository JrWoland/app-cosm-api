import { TreatmentRepository } from '../../repo';
import { UpdateTreatmentController } from './UpdateTreatmentController';
import { UpdateTreatmentUseCase } from './UpdateTreatmentUseCase';

const updateTreatmentUseCase = new UpdateTreatmentUseCase(TreatmentRepository);
const updateTreatmentController = new UpdateTreatmentController(updateTreatmentUseCase);

export { updateTreatmentController };
