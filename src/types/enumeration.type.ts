import {
  AnyEnumeration,
  Enumeration,
  EnumerationConstructorParams,
  EnumerationGenerator,
} from '#core/enumeration';
import { Class } from 'type-fest';

export type EnumerationClass<T extends AnyEnumeration> = Class<T, EnumerationConstructorParams> &
  typeof Enumeration & {
    [key in keyof T]?: EnumerationGenerator<T>;
  };
