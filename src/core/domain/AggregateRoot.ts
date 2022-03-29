import { Result } from '../logic/Result';
import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueId';

export abstract class AggregateRoot<T> extends Entity<T> {}
