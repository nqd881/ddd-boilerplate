import { AnyAggregate } from '#core/aggregate';
import { GetProps } from '#core/props-envelope';
import { defineAggregateMetadata } from '#metadata/aggregate.metadata';
import { PropsOptions } from '#metadata/props.metadata';
import { AggregateClass } from '#types/aggregate.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const AggregateType = <T extends AnyAggregate>(
  propsClass: Class<GetProps<T>>,
  aggregateType?: string,
  options?: PropsOptions,
) => {
  return <U extends AggregateClass<T>>(target: U) => {
    defineAggregateMetadata(target, {
      aggregateType: aggregateType ?? target.name,
    });

    return PropsEnvelopeType(propsClass, options)(target);
  };
};
