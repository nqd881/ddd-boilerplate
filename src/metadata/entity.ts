import { AnyEntity } from '#core/entity';
import { Class } from 'type-fest';
import { ENTITY_TYPE } from './constants';
import { EntityTypeHasNotBeenSetError } from './errors';
import { Registry } from './registry';

export const EntityRegistry = new Registry<Class<AnyEntity>>();

export const defineEntityType = (target: object, eventType: string) => {
  Reflect.defineMetadata(ENTITY_TYPE, eventType, target);
};

export const getEntityType = (target: object): string => {
  const entityType = Reflect.getMetadata(ENTITY_TYPE, target);

  if (!entityType) throw new EntityTypeHasNotBeenSetError();

  return entityType;
};
