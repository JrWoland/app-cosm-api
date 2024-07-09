import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCardTemplateDTO } from './card-template-create/CreateCardTemplateDTO';
import { CreateCardTemplateCommand } from './card-template-create/CreateCardTemplateCommand';

const accountId = 'd6cd4034-f902-4958-8735-c0e71f383553';

@Controller('card-template')
export class CardTemplatesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  async getCard(@Body() dto: CreateCardTemplateDTO) {
    const { name, fields } = dto;

    return await this.commandBus.execute(new CreateCardTemplateCommand(accountId, name, fields));
  }
}
