import { IsDefined, ArrayNotEmpty } from 'class-validator';

class TemplateField {
  description: string;

  identifier: string;

  label: string;

  optionalValues: string[];

  value: string[];
}

export class CreateCardTemplateDTO {
  @IsDefined()
  public readonly name: string;

  public readonly description: string;

  @ArrayNotEmpty()
  public readonly fields: TemplateField[];
}
