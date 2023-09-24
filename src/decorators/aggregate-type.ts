import { AnyAggregate } from '#core/aggregate';
import { GetEntityProps } from '#core/entity';
import { AggregateMetadata } from '#metadata/aggregate.metadata';
import { AggregateClass } from '#types/aggregate.type';
import 'reflect-metadata';
import { Class } from 'type-fest';

export const AggregateType = <T extends AnyAggregate>(
  propsClass: Class<GetEntityProps<T>>,
  aggregateType?: string,
) => {
  return <U extends AggregateClass<T>>(target: U) => {
    AggregateMetadata.defineAggregateMetadata(
      target,
      new AggregateMetadata(aggregateType ?? target.name, propsClass),
    );
  };
};
