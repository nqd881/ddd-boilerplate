import { EnumerationClass } from '#types/enumeration.type';
import 'reflect-metadata';
import { ENUMERATION_TYPE } from './constants';
import { AnyEnumeration } from '#core/enumeration';

export const EnumerationType = <T extends AnyEnumeration>(enumerationType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    Reflect.defineMetadata(ENUMERATION_TYPE, enumerationType, target);
  };
};
