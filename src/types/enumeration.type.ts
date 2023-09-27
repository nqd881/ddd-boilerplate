import { AnyEnumeration, Enumeration } from '#core/enumeration';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type EnumerationConstructorParams = ConstructorParameters<typeof Enumeration>;

export type EnumerationClass<T extends AnyEnumeration> = Class<T, EnumerationConstructorParams> &
  ClassTypeWithoutConstructorAndPrototype<typeof Enumeration> & {
    [key in keyof T]?: T;
  };
