import { Aggregate, AggregateConstructorParams, AnyAggregate } from '#core/aggregate';
import { GetEntityProps } from '#core/entity';
import { Class } from 'type-fest';

export type AggregateClass<T extends AnyAggregate> = Omit<
  typeof Aggregate<GetEntityProps<T>>,
  'constructor'
> &
  Class<T, AggregateConstructorParams<T>>;
