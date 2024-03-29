import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

const ALLOWED_STATUSES = ['ACTIVE', 'ARCHIVED', 'BANNED'] as const;
type AllowedStatusesTuple = typeof ALLOWED_STATUSES;
type ClientStatusType = AllowedStatusesTuple[number];

export class ClientStatus extends ValueObject<ClientStatusType> {
  private constructor(private status: ClientStatusType) {
    super(status);
  }

  public get value() {
    return this.status;
  }

  static get allowedStatuses(): AllowedStatusesTuple {
    return ALLOWED_STATUSES;
  }

  public static isStatusValid(status: string): status is ClientStatusType {
    return ClientStatus.allowedStatuses.includes(status as ClientStatusType);
  }

  public static create(status: ClientStatusType): ClientStatus {
    if (!ClientStatus.isStatusValid(status)) {
      throw new UnprocessableEntityException(`Status is not valid: ${status}. Allowed statuses: ${ClientStatus.allowedStatuses.join(', ')}`);
    }
    return new ClientStatus(status);
  }
}
