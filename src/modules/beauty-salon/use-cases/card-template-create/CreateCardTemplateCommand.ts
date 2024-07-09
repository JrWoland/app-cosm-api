type Field = {
  description: string;
  identifier: string;
  label: string;
  optionalValues: string[];
  value: string[];
};

export class CreateCardTemplateCommand {
  constructor(
    public readonly accountId: string,
    public readonly name: string,
    public readonly fields: Array<Field>,
  ) {}
}
