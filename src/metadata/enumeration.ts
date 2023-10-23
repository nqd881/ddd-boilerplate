import { AnyEnumeration } from '#core/enumeration';
import { Class } from 'type-fest';
import { ENUMERATION_TYPE } from './constants';
import { EnumerationTypeHasNotBeenSetError } from './errors';
import { Registry } from './registry';

export const EnumerationRegistry = new Registry<Class<AnyEnumeration>>();

export const defineEnumerationType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENUMERATION_TYPE, eventType, target);
};

export const getEnumerationType = (target: object): string => {
  const enumerationType = Reflect.getMetadata(ENUMERATION_TYPE, target);

  if (!enumerationType) throw new EnumerationTypeHasNotBeenSetError();

  return enumerationType;
};
