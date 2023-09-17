import {
  AnyValueObject,
  GetValueObjectProps,
  ValueObject,
  ValueObjectConstructorParams,
} from '#core/value-object';
import { Class } from 'type-fest';

export type ValueObjectClass<T extends AnyValueObject> = Omit<
  typeof ValueObject<GetValueObjectProps<T>>,
  'constructor'
> &
  Class<T, ValueObjectConstructorParams<T>>;
