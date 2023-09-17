import { AnyAggregate } from '#core/aggregate';
import { AggregateClass } from '#types/aggregate.type';
import { AGGREGATE_TYPE } from './constants';
import 'reflect-metadata';

export const AggregateType = <T extends AnyAggregate>(aggregateType?: string) => {
  return <U extends AggregateClass<T>>(target: U) => {
    Reflect.defineMetadata(AGGREGATE_TYPE, aggregateType, target);
  };
};
