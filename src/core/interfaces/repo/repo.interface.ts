import { AnyAggregate } from '#core/aggregate';
import { Promisable } from 'type-fest';

export interface IRepo<A extends AnyAggregate> {
  findById(id: string): Promisable<A | null>;

  create(aggregates: A | A[]): Promisable<any>;

  updateOne(aggregate: A): Promisable<any>;

  save(aggregate: A): Promisable<any>;

  delete(aggregateId: string): Promisable<any>;
}
