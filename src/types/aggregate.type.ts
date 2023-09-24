import { Aggregate, AggregateConstructorParams, AnyAggregate } from '#core/aggregate';
import { EntityProps, GetEntityProps } from '#core/entity';
import { Class } from 'type-fest';

export type AggregateClass<T extends AnyAggregate> = Omit<
  typeof Aggregate<GetEntityProps<T>>,
  'constructor'
> &
  Class<T, AggregateConstructorParams<T>>;

export type AggregateClassWithProps<P extends EntityProps> = AggregateClass<Aggregate<P>>;
