import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

const ALLOWED_STATUSES = ['CLIENT_NOT_APPEARD', 'DECLINED', 'FINISHED', 'NEW'] as const;
type AllowedStatusesTuple = typeof ALLOWED_STATUSES;
type AppointmentStatusType = AllowedStatusesTuple[number];

export class AppointmentStatus extends ValueObject<AppointmentStatusType> {
  private constructor(private status: AppointmentStatusType) {
    super(status);
  }

  public get value() {
    return this.status;
  }

  static get allowedStatuses(): AllowedStatusesTuple {
    return ALLOWED_STATUSES;
  }

  public static isStatusValid(status: string): status is AppointmentStatusType {
    return AppointmentStatus.allowedStatuses.includes(status as AppointmentStatusType);
  }

  public static create(status: string): Result<AppointmentStatus> {
    if (!AppointmentStatus.isStatusValid(status)) {
      return Result.fail<AppointmentStatus>(`Status is not valid: ${status}. Allowed statuses: ${AppointmentStatus.allowedStatuses.join(', ')}`);
    }
    return Result.ok<AppointmentStatus>(new AppointmentStatus(status));
  }
}
