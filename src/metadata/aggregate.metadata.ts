import { AnyAggregate } from '#core/aggregate';
import { EntityProps, GetEntityProps } from '#core/entity';
import { Class } from 'type-fest';
import { AGGREGATE_METADATA } from './constants';
import { EntityMetadata } from './entity.metadata';

export class AggregateMetadata<P extends EntityProps> extends EntityMetadata<P> {
  public readonly aggregateType: string;

  constructor(aggregateType: string, propsClass: Class<P>) {
    super(aggregateType, propsClass);

    this.aggregateType = aggregateType;
  }

  static defineAggregateMetadata<T extends AnyAggregate>(
    target: Class<T>,
    metadata: AggregateMetadata<GetEntityProps<T>>,
  ) {
    Reflect.defineMetadata(AGGREGATE_METADATA, metadata, target);

    super.defineEntityMetadata(target, metadata);
  }

  static getAggregateMetadata<T extends AnyAggregate>(
    target: Class<T>,
  ): AggregateMetadata<GetEntityProps<T>> {
    return Reflect.getMetadata(AGGREGATE_METADATA, target);
  }
}
