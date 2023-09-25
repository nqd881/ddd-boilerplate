import { Aggregate, AggregateConstructorParams, AnyAggregate } from '#core/aggregate';
import { GetProps, Props } from '#core/props-envelope';
import { Class } from 'type-fest';

export type AggregateClass<T extends AnyAggregate> = Omit<
  typeof Aggregate<GetProps<T>>,
  'constructor'
> &
  Class<T, AggregateConstructorParams<T>>;

export type AggregateClassWithProps<P extends Props> = AggregateClass<Aggregate<P>>;
