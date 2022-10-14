import { List } from '../../../core/domain/List';
import { Treatment } from './Treatment';

export class Treatments extends List<Treatment> {
  private constructor(list: Treatment[]) {
    super(list);
  }

  public static create(list: Treatment[]): List<Treatment> {
    return new Treatments(list);
  }
}
