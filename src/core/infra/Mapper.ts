export interface Mapper<T> {
  toPersistence(t: T): any;
  toDomain(raw: any): T;
}
