import { ENUMERATION_TYPE } from './constants';
import { EnumerationTypeHasNotBeenSetError } from './errors';

export const defineEnumerationType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENUMERATION_TYPE, eventType, target);
};

export const getEnumerationType = (target: object): string => {
  const enumerationType = Reflect.getMetadata(ENUMERATION_TYPE, target);

  if (!enumerationType) throw new EnumerationTypeHasNotBeenSetError();

  return enumerationType;
};
