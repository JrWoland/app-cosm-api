import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTreatmentCommand } from './treatment-create/CreateTreatmentCommand';
import { CreateTreatmentDTO } from './treatment-create/CreateTreatmentDTO';
import { EditTreatmentDetailsDTO } from './treatment-edit-details/EditTreatmentDetailsDTO';
import { EditTreatmentDetailsCommand } from './treatment-edit-details/EditTreatmentDetailsCommand';
import { GetTreatmentsListDTO } from './treatment-get-list/GetTreatmentsList';
import { GetTreatmentsListQuery } from './treatment-get-list/GetTreatmentsListQuery';
const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('treatment')
export class TreatmentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('list')
  async getTreatmentsList(@Query() query: GetTreatmentsListDTO) {
    const { name, limit, page, status } = query;
    return await this.queryBus.execute(new GetTreatmentsListQuery(accountId, page, limit, status, name));
  }

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
