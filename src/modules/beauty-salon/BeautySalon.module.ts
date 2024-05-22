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
import { RemoveAppointmentUseCase } from './use-cases/appointment-remove/RemoveAppointmentUseCase';
import { ClientModel, ClientSchema } from 'src/db/mongoose/client.sheema';
import { ClientRepository } from './repos/Client.repository';
import { ClientsController } from './use-cases/Clients.controller';
import { CreateClientUseCase } from './use-cases/client-create/CreateClientUseCase';
import { GetClientsListUseCase } from './use-cases/client-get-list/GetClientsListUseCase';
import { ArchiveClientUseCase } from './use-cases/client-archive/ArchiveClientUseCase';
import { EditClientDetailsUseCase } from './use-cases/client-edit-details/EditClientDetailsUseCase';
import { GetClientByIdUseCase } from './use-cases/client-get/GetClientByIdUseCase';
import { EditTreatmentDetailsUseCase } from './use-cases/treatment-edit-details/EditTreatmentDetailsUseCase';
import { GetTreatmentsListUseCase } from './use-cases/treatment-get-list/GetTreatmentsListUseCase';
import { ArchiveTreatmentUseCase } from './use-cases/treatment-archive/ArchiveTreatmentUseCase';
import { GetTreatmentByIdUseCase } from './use-cases/treatment-get/GetTreatmentByIdUseCase';
import { CardsController } from './use-cases/Cards.controller';
import { CreateCardUseCase } from './use-cases/card-create/CreateCardUseCase';
import { CardModel, CardSchema } from 'src/db/mongoose/card.sheema';
import { CardsRepository } from './repos/Cards.repository';
import { GetCardByIdUseCase } from './use-cases/card-get/GetCardByIdUseCase';
import { GetCardsListUseCase } from './use-cases/card-get-list/GetCardsListUseCase';
import { DeleteCardByIdUseCase } from './use-cases/card-delete/DeleteCardByIdUseCase';
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: AppointmentModel.name, schema: AppointmentSchema },
      { name: TreatmentModel.name, schema: TreatmentSchema },
      { name: ClientModel.name, schema: ClientSchema },
      { name: CardModel.name, schema: CardSchema },
    ]),
  ],
  controllers: [AppointmentsController, TreatmentsController, ClientsController, CardsController],
  providers: [
    CreateAppointmentUseCase,
    CreateTreatmentUseCase,
    CreateClientUseCase,
    GetAppointmentUseCase,
    GetClientsListUseCase,
    GetClientByIdUseCase,
    GetTreatmentsListUseCase,
    GetTreatmentByIdUseCase,
    GetCardByIdUseCase,
    GetCardsListUseCase,
    DeleteCardByIdUseCase,
    CreateCardUseCase,
    ArchiveClientUseCase,
    ArchiveTreatmentUseCase,
    EditClientDetailsUseCase,
    EditTreatmentDetailsUseCase,
    RemoveAppointmentUseCase,
    AppointmentRepository,
    TreatmentRepository,
    ClientRepository,
    CardsRepository,
  ],
})
export class BeautySalonModule {}
