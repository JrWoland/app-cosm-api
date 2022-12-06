import { AppoinmentRepository, TreatmentRepository } from '../../repo';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';
import { CreateAppoinmentController } from './CreateAppoinmentController';
import { AccountRepository } from '../../../accounts/repo';
import { TreatmentService } from '../../services/TreatmentService';

const treatmentService = new TreatmentService();

const createAppoinmentUseCase = new CreateAppoinmentUseCase(AppoinmentRepository, AccountRepository, TreatmentRepository, treatmentService);
const createAppoinmentController = new CreateAppoinmentController(createAppoinmentUseCase);

export { createAppoinmentController };
