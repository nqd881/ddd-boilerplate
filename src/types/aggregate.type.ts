import { AggregateBase, AnyAggregate } from '#core/aggregate';
import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type AggregateConstructorParamsWithProps<P extends object> = ConstructorParameters<
  typeof AggregateBase<P>
>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<GetProps<T>>;

export type AggregateClass<T extends AnyAggregate> = Class<T, AggregateConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof AggregateBase<GetProps<T>>>;

export type AggregateClassWithProps<P extends object> = AggregateClass<AggregateBase<P>>;

export type AnyAggregateClass = AggregateClass<AnyAggregate>;
