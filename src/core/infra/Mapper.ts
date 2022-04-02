export interface Mapper<Entity, DocModel> {
  toPersistence(t: Entity): DocModel;
  toDomain(raw: DocModel): Entity;
}
