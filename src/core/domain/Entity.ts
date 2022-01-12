import { UniqueEntityID } from './UniqueId';

export abstract class Entity {
  protected readonly _uniqueEntityId: UniqueEntityID;

  constructor(id?: UniqueEntityID) {
    this._uniqueEntityId = id ? id : new UniqueEntityID();
  }
}
