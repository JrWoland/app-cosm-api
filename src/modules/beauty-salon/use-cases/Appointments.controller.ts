import { Body, Controller, Get, Post, Delete, Query, UnprocessableEntityException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from './appointment-create/CreateAppointmentCommand';
import { CreateAppoinmentDTO } from './appointment-create/CreateAppoinmentDTO';
import { GetAppointmentQuery } from './appointment-get-list/GetAppointmentQuery';
import { GetAppointmentListDTO } from './appointment-get-list/GetAppointmentDTO';
import { RemoveAppoinmentDTO } from './appointment-remove/RemoveAppoinmentDTO';
import { RemoveAppointmentCommand } from './appointment-remove/RemoveAppointmentCommand';

const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';
@Controller('appointment')
export class AppointmentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  private getUnprocessableEntities(dto: CreateAppoinmentDTO) {
    const values = [];

    if (!dto.clientId) values.push('clientId');
    if (!dto.date) values.push('date');
    if (!dto.startTime) values.push('startTime');
    if (!dto.status) values.push('status');

    return values.join(', ');
  }

  @Post('create')
  async createAppointment(@Body() dto: CreateAppoinmentDTO) {
    const { clientId, date, startTime, status, treatments = [] } = dto;

    const isUnprocesable = !accountId || !date || !clientId || !startTime || !status;
    const noTreatments = treatments?.length === 0;

    if (isUnprocesable) {
      throw new UnprocessableEntityException(
        `Cannot create appointment with undefined values. Unprocesable values: ${this.getUnprocessableEntities(dto)}.`,
      );
    }
    if (noTreatments) {
      throw new UnprocessableEntityException('Cannot create appointment without treatments.');
    }

    return await this.commandBus.execute(new CreateAppointmentCommand(accountId, date, clientId, startTime, status, treatments));
  }

  @Get('list')
  async findAll(@Query() query: GetAppointmentListDTO): Promise<any> {
    const { page = 1, limit = 10, status = '', dateFrom = '', dateTo = '', clientId = '', beautyServiceId = '' } = query;
    return this.queryBus.execute(new GetAppointmentQuery(accountId, clientId, page, limit, status, dateFrom, dateTo, beautyServiceId));
  }

  @Delete('delete')
  async remove(@Body() dto: RemoveAppoinmentDTO): Promise<any> {
    const { id } = dto;
    return this.commandBus.execute(new RemoveAppointmentCommand(accountId, id));
  }
}
