import { Promisable } from 'type-fest';
import { AnyAggregate } from './aggregate';

export interface IRepoBase<AR extends AnyAggregate> {
  findById(id: string): Promisable<AR>;

  create(aggregates: AR | AR[]): Promisable<any>;

  updateOne(aggregate: AR): Promisable<any>;

  save(aggregate: AR): Promisable<any>;

  delete(aggregateId: string): Promisable<any>;
}
