import { AnyEnumeration, EnumerationBase } from '#core/enumeration';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type EnumerationConstructorParams = ConstructorParameters<typeof EnumerationBase>;

export type EnumerationClass<T extends AnyEnumeration> = Class<T, EnumerationConstructorParams> &
  ClassTypeWithoutConstructorAndPrototype<typeof EnumerationBase> & {
    [key in keyof T]?: T;
  };

export type AnyEnumerationClass = EnumerationClass<AnyEnumeration>;
