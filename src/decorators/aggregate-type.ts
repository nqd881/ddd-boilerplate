import { AnyAggregate } from '#core/aggregate';
import { GetProps } from '#core/props-envelope';
import { AggregateClass } from '#types/aggregate.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';
import { AggregateMetadata } from '#metadata/aggregate.metadata';

export const AggregateType = <T extends AnyAggregate>(
  propsClass: Class<GetProps<T>>,
  aggregateType?: string,
) => {
  return <U extends AggregateClass<T>>(target: U) => {
    AggregateMetadata.defineAggregateMetadata(
      target,
      new AggregateMetadata(aggregateType ?? target.name),
    );

    return PropsEnvelopeType(propsClass)(target);
  };
};
