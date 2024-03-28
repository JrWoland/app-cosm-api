import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTreatmentCommand } from './treatment-create/CreateTreatmentCommand';
import { CreateTreatmentDTO } from './treatment-create/CreateTreatmentDTO';

@Controller('treatment')
export class TreatmentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create')
  async createTreatment(@Body() dto: CreateTreatmentDTO) {
    const { duration, name, price, description, defaultCardId } = dto;

    const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

    return await this.commandBus.execute(new CreateTreatmentCommand(accountId, name, price, duration, description, defaultCardId));
  }
}
