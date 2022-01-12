export interface Mapper {
  toDomain(raw: any): any;
  toPersistence(t: any): any;
}
