import { Entity } from './Entity';

Entity;
export abstract class List<Entity> {
  public readonly list: Entity[];

  constructor(list: Entity[]) {
    this.list = list;
  }
}
