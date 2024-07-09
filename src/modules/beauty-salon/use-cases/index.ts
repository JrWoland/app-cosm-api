import { CreateAppointmentUseCase } from './appointment-create/CreateAppointmentUseCase';
import { GetAppointmentUseCase } from './appointment-get-list/GetAppointmentUseCase';
import { CreateTreatmentUseCase } from './treatment-create/CreateTreatmentUseCase';
import { RemoveAppointmentUseCase } from './appointment-remove/RemoveAppointmentUseCase';
import { CreateClientUseCase } from './client-create/CreateClientUseCase';
import { GetClientsListUseCase } from './client-get-list/GetClientsListUseCase';
import { ArchiveClientUseCase } from './client-archive/ArchiveClientUseCase';
import { EditClientDetailsUseCase } from './client-edit-details/EditClientDetailsUseCase';
import { GetClientByIdUseCase } from './client-get/GetClientByIdUseCase';
import { EditTreatmentDetailsUseCase } from './treatment-edit-details/EditTreatmentDetailsUseCase';
import { GetTreatmentsListUseCase } from './treatment-get-list/GetTreatmentsListUseCase';
import { ArchiveTreatmentUseCase } from './treatment-archive/ArchiveTreatmentUseCase';
import { GetTreatmentByIdUseCase } from './treatment-get/GetTreatmentByIdUseCase';
import { CreateCardUseCase } from './card-create/CreateCardUseCase';
import { GetCardByIdUseCase } from './card-get/GetCardByIdUseCase';
import { GetCardsListUseCase } from './card-get-list/GetCardsListUseCase';
import { DeleteCardByIdUseCase } from './card-delete/DeleteCardByIdUseCase';
import { CreateCardTemplateUseCase } from './card-template-create/CreateCardTemplateUseCase';

import { AppointmentsController } from './Appointments.controller';
import { TreatmentsController } from './Treatments.controller';
import { ClientsController } from './Clients.controller';
import { CardsController } from './Cards.controller';
import { CardTemplatesController } from './CardTemplates.controller';
import { GetAppointmentByIdUseCase } from './appointment-get/GetAppointmentByIdUseCase';

export const controllers = [AppointmentsController, TreatmentsController, ClientsController, CardsController, CardTemplatesController];

export const useCases = [
  CreateAppointmentUseCase,
  GetAppointmentUseCase,
  GetAppointmentByIdUseCase,
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
  CreateCardTemplateUseCase,
  ArchiveClientUseCase,
  ArchiveTreatmentUseCase,
  EditClientDetailsUseCase,
  EditTreatmentDetailsUseCase,
  RemoveAppointmentUseCase,
];
