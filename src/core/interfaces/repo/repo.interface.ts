import { AnyAggregate } from '#core/aggregate';
import { Promisable } from 'type-fest';

export interface IRepo<AR extends AnyAggregate> {
  findById(id: string): Promisable<AR | null>;

  create(aggregates: AR | AR[]): Promisable<any>;

  updateOne(aggregate: AR): Promisable<any>;

  save(aggregate: AR): Promisable<any>;

  delete(aggregateId: string): Promisable<any>;
}
