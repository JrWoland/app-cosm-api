import { ValueObject } from 'src/shared/ValueObject';
import { ClientId } from '../client/ClientId';
import { UnprocessableEntityException } from '@nestjs/common';

type IAppointmentClientDetails = {
  readonly id: ClientId;
  readonly name: string;
  readonly surname: string;
};

export class AppointmentClientDetails extends ValueObject<IAppointmentClientDetails> {
  private constructor(private details: IAppointmentClientDetails) {
    super(details);
  }

  get value() {
    return this.details;
  }

  static create(props: IAppointmentClientDetails): AppointmentClientDetails {
    const { id, name, surname } = props;

    if (!id || !name || !surname)
      throw new UnprocessableEntityException(
        `Cannot create client details. Some of following properties is missing: id: ${id}, name: ${name}, surname: ${surname}`,
      );

    return new AppointmentClientDetails(props);
  }
}
