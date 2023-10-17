import { AnyEnumerationClass } from '#types/enumeration.type';
import { ENUMERATION_TYPE } from './constants';
import { EnumerationTypeHasNotBeenSetError } from './errors';
import { Registry } from './registry';

export const EnumerationRegistry = new Registry<AnyEnumerationClass>();

export const defineEnumerationType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENUMERATION_TYPE, eventType, target);
};

export const getEnumerationType = (target: object): string => {
  const enumerationType = Reflect.getMetadata(ENUMERATION_TYPE, target);

  if (!enumerationType) throw new EnumerationTypeHasNotBeenSetError();

  return enumerationType;
};
