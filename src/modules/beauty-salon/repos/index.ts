import { AppointmentModel, AppointmentSchema } from 'src/db/mongoose/appointment.sheema';
import { CardModel, CardSchema } from 'src/db/mongoose/card.sheema';
import { CardTemplateModel, CardTemplateSchema } from 'src/db/mongoose/cardTemplate.sheema';
import { ClientModel, ClientSchema } from 'src/db/mongoose/client.sheema';
import { TreatmentModel, TreatmentSchema } from 'src/db/mongoose/treatment.sheema';
import { AppointmentRepository } from './Appointment.repository';
import { TreatmentRepository } from './Treatment.repository';
import { ClientRepository } from './Client.repository';
import { CardsRepository } from './Cards.repository';
import { CardTemplatesRepository } from './CardTemplates.repository';

export const reposModels = [
  { name: AppointmentModel.name, schema: AppointmentSchema },
  { name: TreatmentModel.name, schema: TreatmentSchema },
  { name: ClientModel.name, schema: ClientSchema },
  { name: CardModel.name, schema: CardSchema },
  { name: CardTemplateModel.name, schema: CardTemplateSchema },
];
export const repos = [AppointmentRepository, TreatmentRepository, ClientRepository, CardsRepository, CardTemplatesRepository];
