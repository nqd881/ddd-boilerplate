import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';
import { AnyValueObject, ValueObjectBase } from '#core/value-object';

export type ValueObjectConstructorParamsWithProps<P extends object> = ConstructorParameters<
  typeof ValueObjectBase<P>
>;

export type ValueObjectConstructorParams<T extends AnyValueObject> =
  ValueObjectConstructorParamsWithProps<GetProps<T>>;

export type ValueObjectClass<T extends AnyValueObject> = Class<T, ValueObjectConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof ValueObjectBase<GetProps<T>>>;

export type ValueObjectClassWithProps<P extends object> = ValueObjectClass<ValueObjectBase<P>>;
