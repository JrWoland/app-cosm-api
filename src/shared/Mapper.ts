export interface Mapper<Entity, Model> {
  // toPersistence(t: Entity): Model;
  toDomain(raw: Model): Entity;
}
