import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueId';

export abstract class AggregateRoot extends Entity {
  get id(): UniqueEntityID {
    return this._uniqueEntityId;
  }
}
