import { Aggregate, AnyAggregate } from '#core/aggregate';
import { GetProps, Props } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type AggregateConstructorParamsWithProps<P extends Props> = ConstructorParameters<
  typeof Aggregate<P>
>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<GetProps<T>>;

export type AggregateClass<T extends AnyAggregate> = Class<T, AggregateConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof Aggregate<GetProps<T>>>;

export type AggregateClassWithProps<P extends Props> = AggregateClass<Aggregate<P>>;
