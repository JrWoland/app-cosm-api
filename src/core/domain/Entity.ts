import { Result } from '../logic/Result';
import { UniqueEntityID } from './UniqueId';
export abstract class Entity<T> {
  protected readonly _uniqueEntityId: UniqueEntityID;
  public readonly props: T;
  public readonly errors: Result<string>[];

  constructor(props: T, id?: UniqueEntityID) {
    this._uniqueEntityId = id ? id : new UniqueEntityID();
    this.props = props;
    this.errors = [];
  }

  public get isAnyErrorRegistered(): boolean {
    return this.errors.length > 0;
  }

  public get errorsListAsString(): string {
    if (!this.isAnyErrorRegistered) return '';
    return this.errors.reduce((prev, curr) => (prev += curr.error), '');
  }

  public registerError(error: Result<string>): void {
    this.errors.push(error);
  }
}
