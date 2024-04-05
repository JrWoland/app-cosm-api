import { TreatmentId } from '../treatment/TreatmentId';
import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type AppointmentTreatmentProps = {
  readonly treatmentId: TreatmentId;
  readonly name: string;
  readonly startTime: number;
  readonly duration: number;
};

export class AppointmentTreatment extends ValueObject<AppointmentTreatmentProps> {
  private constructor(props: AppointmentTreatmentProps) {
    super(props);
  }

  public get treatmentId() {
    return this.props.treatmentId;
  }

  public get name() {
    return this.props.name;
  }

  public get startTime() {
    return this.props.startTime;
  }

  public get duration() {
    return this.props.duration;
  }

  public static create(props: AppointmentTreatmentProps): AppointmentTreatment {
    if (!props.name) throw new UnprocessableEntityException(`Treatment name cannot be empty.`);
    if (!props.treatmentId) throw new UnprocessableEntityException(`TreatmentId is cannot be empty: ${JSON.stringify(props.treatmentId)}`);
    if (props.duration <= 0)
      throw new UnprocessableEntityException(`Duration of the appointment entity cannot be less or equal 0. Provided value: ${props.duration}`);
    if (props.startTime <= 0)
      throw new UnprocessableEntityException(`Start time of the appointment entity cannot be less or equal 0. Provided value: ${props.startTime}`);

    return new AppointmentTreatment(props);
  }
}
