import { Class } from 'type-fest';
import { ENTITY_TYPE } from './constants';
import { AnyEntity } from '#core/entity';

export const defineEntityType = <T extends AnyEntity>(target: Class<T>, eventType: string) => {
  Reflect.defineMetadata(ENTITY_TYPE, eventType, target);
};

export const getEntityType = <T extends AnyEntity>(target: Class<T>): string => {
  return Reflect.getMetadata(ENTITY_TYPE, target);
};
