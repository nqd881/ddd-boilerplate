import { VALUE_OBJECT_TYPE } from './constants';

export const defineValueObjectType = (target: object, eventType: string) => {
  Reflect.defineMetadata(VALUE_OBJECT_TYPE, eventType, target);
};

export const getValueObjectType = (target: object): string => {
  return Reflect.getMetadata(VALUE_OBJECT_TYPE, target);
};
