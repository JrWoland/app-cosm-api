import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppointmentsController } from './use-cases/Appointments.controller';
import { CreateAppointmentUseCase } from './use-cases/appointment-create/CreateAppointmentUseCase';
import { AppointmentRepository } from './repos/Appointment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModel, AppointmentSchema } from '../../db/mongoose/appointment.sheema';
import { GetAppointmentUseCase } from './use-cases/appointment-get-list/GetAppointmentUseCase';
import { TreatmentRepository } from './repos/Treatment.repository';
import { TreatmentModel, TreatmentSchema } from 'src/db/mongoose/treatment.sheema';
import { TreatmentsController } from './use-cases/Treatments.controller';
import { CreateTreatmentUseCase } from './use-cases/treatment-create/CreateTreatmentUseCase';
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: AppointmentModel.name, schema: AppointmentSchema },
      { name: TreatmentModel.name, schema: TreatmentSchema },
    ]),
  ],
  controllers: [AppointmentsController, TreatmentsController],
  providers: [CreateAppointmentUseCase, CreateTreatmentUseCase, GetAppointmentUseCase, AppointmentRepository, TreatmentRepository],
})
export class BeautySalonModule {}
