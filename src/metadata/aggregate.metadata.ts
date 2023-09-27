import { AnyAggregate } from '#core/aggregate';
import { Class } from 'type-fest';
import { AGGREGATE_METADATA } from './constants';

export interface AggregateMetadata {
  aggregateType: string;
}

export function defineAggregateMetadata<T extends AnyAggregate>(
  target: Class<T>,
  metadata: AggregateMetadata,
) {
  Reflect.defineMetadata(AGGREGATE_METADATA, metadata, target);
}

export function getAggregateMetadata<T extends AnyAggregate>(target: Class<T>): AggregateMetadata {
  return Reflect.getMetadata(AGGREGATE_METADATA, target);
}
