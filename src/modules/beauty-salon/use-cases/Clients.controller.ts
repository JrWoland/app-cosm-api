import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientDTO } from './client-create/CreateClientDTO';
import { CreateClientCommand } from './client-create/CreateClientCommand';
import { GetClientsListDTO } from './client-get-list/GetClientsListDTO';
import { GetClientsListQuery } from './client-get-list/GetClientsListQuery';
import { ArchiveClientDTO } from './client-archive/ArchiveClientDTO';
import { ArchiveClientCommand } from './client-archive/ArchiveClientCommand';
import { EditClientDetailsDTO } from './client-edit-details/EditClientDetailsDTO';
import { EditClientDetailsCommand } from './client-edit-details/EditClientDetailsCommand';
import { GetClientByIdQuery } from './client-get/GetClientByIdQuery';
import { GetClientByIdDTO } from './client-get/GetClientByIdDTO';
import { ActivateClientDTO } from './client-activate/ActivateClientDTO';
import { ActivateClientCommand } from './client-activate/ActivateClientCommand';

const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('client')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  async getClient(@Query() dto: GetClientByIdDTO) {
    const { id } = dto;

    return await this.queryBus.execute(new GetClientByIdQuery(accountId, id));
  }

  @Get('list')
  async findAll(@Query() query: GetClientsListDTO) {
    const { page = 1, limit = 10, status = '', fullName } = query;
    return this.queryBus.execute(new GetClientsListQuery(accountId, page, limit, status, fullName));
  }

  @Post('create')
  async createClient(@Body() dto: CreateClientDTO) {
    const { name, surname, birthDay, email, phone } = dto;

    return await this.commandBus.execute(new CreateClientCommand(accountId, name, surname, birthDay, phone, email));
  }

  @Put('edit-details')
  async editClientDetails(@Body() dto: EditClientDetailsDTO) {
    const { id, name, surname, birthDay, email, phone } = dto;
    return await this.commandBus.execute(new EditClientDetailsCommand(accountId, id, name, surname, birthDay, phone, email));
  }

  @Put('archive')
  async archive(@Body() dto: ArchiveClientDTO) {
    const { id } = dto;
    return this.commandBus.execute(new ArchiveClientCommand(accountId, id));
  }

  @Put('activate')
  async activate(@Body() dto: ActivateClientDTO) {
    const { id } = dto;
    return this.commandBus.execute(new ActivateClientCommand(accountId, id));
  }
}
