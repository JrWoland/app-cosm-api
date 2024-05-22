import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateCardDTO } from './card-create/CreateCardDTO';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCardCommand } from './card-create/CreateCardCommand';
import { GetCardByIdDTO } from './card-get/GetCardByIdDTO';
import { GetCardByIdQuery } from './card-get/GetCardByIdQuery';
import { GetCardsListQuery } from './card-get-list/GetCardsListQuery';
import { GetCardsListDTO } from './card-get-list/GetCardsListDTO';
import { DeleteCardByIdDTO } from './card-delete/DeleteCardByIdDTO';
import { DeleteCardByIdQuery } from './card-delete/DeleteCardByIdQuery';
const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('card')
export class CardsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  async getCard(@Query() query: GetCardByIdDTO) {
    const { id } = query;

    return await this.queryBus.execute(new GetCardByIdQuery(accountId, id));
  }

  @Get('list')
  async getCardList(@Query() query: GetCardsListDTO) {
    const { page, limit, clientId } = query;

    return await this.queryBus.execute(new GetCardsListQuery(page, limit, accountId, clientId));
  }

  @Post('create')
  async createCard(@Body() dto: CreateCardDTO) {
    const { clientId, date, template, appointmentId } = dto;

    return await this.commandBus.execute(new CreateCardCommand(accountId, clientId, date, template, appointmentId || null));
  }

  @Delete('delete')
  async deleteCard(@Query() query: DeleteCardByIdDTO) {
    const { id } = query;

    return await this.queryBus.execute(new DeleteCardByIdQuery(accountId, id));
  }
}
