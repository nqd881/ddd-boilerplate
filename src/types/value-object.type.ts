import { GetProps, Props } from '#core/props-envelope';
import { AnyValueObject, ValueObject, ValueObjectConstructorParams } from '#core/value-object';
import { Class } from 'type-fest';

export type ValueObjectClass<T extends AnyValueObject> = Omit<
  typeof ValueObject<GetProps<T>>,
  'constructor'
> &
  Class<T, ValueObjectConstructorParams<T>>;

export type ValueObjectClassWithProps<P extends Props> = ValueObjectClass<ValueObject<P>>;
