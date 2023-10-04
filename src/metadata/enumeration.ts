import { Class } from 'type-fest';
import { ENUMERATION_TYPE } from './constants';
import { AnyEnumeration } from '#core/enumeration';

export const defineEnumerationType = <T extends AnyEnumeration>(
  target: Class<T>,
  eventType: string,
) => {
  Reflect.defineMetadata(ENUMERATION_TYPE, eventType, target);
};

export const getEnumerationType = <T extends AnyEnumeration>(target: Class<T>): string => {
  return Reflect.getMetadata(ENUMERATION_TYPE, target);
};
