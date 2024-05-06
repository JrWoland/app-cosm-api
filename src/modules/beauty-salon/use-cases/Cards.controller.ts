import { Body, Controller, Post } from '@nestjs/common';
import { CreateCardDTO } from './card-create/CreateCardDTO';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCardCommand } from './card-create/CreateCardCommand';
const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('card')
export class CardsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  async createCard(@Body() dto: CreateCardDTO) {
    const { clientId, date, template, appointmentId } = dto;

    return await this.commandBus.execute(new CreateCardCommand(accountId, clientId, date, template, appointmentId || null));
  }
}
