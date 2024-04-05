import { Body, Controller, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTreatmentCommand } from './treatment-create/CreateTreatmentCommand';
import { CreateTreatmentDTO } from './treatment-create/CreateTreatmentDTO';
import { EditTreatmentDetailsDTO } from './treatment-edit-details/EditTreatmentDetailsDTO';
import { EditTreatmentDetailsCommand } from './treatment-edit-details/EditTreatmentDetailsCommand';
const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('treatment')
export class TreatmentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create')
  async createTreatment(@Body() dto: CreateTreatmentDTO) {
    const { duration, name, price, description, defaultCardId } = dto;

    return await this.commandBus.execute(new CreateTreatmentCommand(accountId, name, price, duration, description, defaultCardId));
  }

  @Put('edit')
  async editTreatment(@Body() dto: EditTreatmentDetailsDTO) {
    const { duration, name, price, defaultCardId, id } = dto;

    return await this.commandBus.execute(new EditTreatmentDetailsCommand(accountId, id, name, price, duration, defaultCardId));
  }
}
