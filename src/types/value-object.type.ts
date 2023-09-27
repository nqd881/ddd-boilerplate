import { GetProps, Props } from '#core/props-envelope';
import { AnyValueObject, ValueObject } from '#core/value-object';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type ValueObjectConstructorParamsWithProps<P extends Props> = ConstructorParameters<
  typeof ValueObject<P>
>;

export type ValueObjectConstructorParams<T extends AnyValueObject> =
  ValueObjectConstructorParamsWithProps<GetProps<T>>;

export type ValueObjectClass<T extends AnyValueObject> = Class<T, ValueObjectConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof ValueObject<GetProps<T>>>;

export type ValueObjectClassWithProps<P extends Props> = ValueObjectClass<ValueObject<P>>;
