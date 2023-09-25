import { AnyAggregate } from '#core/aggregate';
import { Class } from 'type-fest';
import { AGGREGATE_METADATA } from './constants';

export class AggregateMetadata {
  public readonly aggregateType: string;

  constructor(aggregateType: string) {
    this.aggregateType = aggregateType;
  }

  static defineAggregateMetadata<T extends AnyAggregate>(
    target: Class<T>,
    metadata: AggregateMetadata,
  ) {
    Reflect.defineMetadata(AGGREGATE_METADATA, metadata, target);
  }

  static getAggregateMetadata<T extends AnyAggregate>(target: Class<T>): AggregateMetadata {
    return Reflect.getMetadata(AGGREGATE_METADATA, target);
  }
}
