import { ENTITY_TYPE } from './constants';

export const defineEntityType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENTITY_TYPE, eventType, target);
};

export const getEntityType = (target: object): string => {
  return Reflect.getMetadata(ENTITY_TYPE, target);
};
