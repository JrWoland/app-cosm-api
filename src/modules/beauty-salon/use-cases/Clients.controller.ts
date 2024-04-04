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

const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('client')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get('list')
  async findAll(@Query() query: GetClientsListDTO): Promise<any> {
    const { page = 1, limit = 10, status = '', fullName } = query;
    return this.queryBus.execute(new GetClientsListQuery(accountId, page, limit, status, fullName));
  }

  @Put('archive')
  async archive(@Body() dto: ArchiveClientDTO): Promise<any> {
    const { id } = dto;
    return this.commandBus.execute(new ArchiveClientCommand(accountId, id));
  }
}
