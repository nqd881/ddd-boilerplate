import { ENUMERATION_TYPE } from './constants';

export const defineEnumerationType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENUMERATION_TYPE, eventType, target);
};

export const getEnumerationType = (target: object): string => {
  return Reflect.getMetadata(ENUMERATION_TYPE, target);
};
