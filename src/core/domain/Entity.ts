import { UniqueEntityID } from './UniqueId';
export abstract class Entity<T> {
  protected readonly _uniqueEntityId: UniqueEntityID;

  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._uniqueEntityId = id ? id : new UniqueEntityID();
    this.props = props;
  }
}
