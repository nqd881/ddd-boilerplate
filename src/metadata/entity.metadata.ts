import { AnyEntity } from '#core/entity';
import { Class } from 'type-fest';
import { ENTITY_METADATA } from './constants';

export interface EntityMetadata {
  entityType: string;
}

export function defineEntityMetadata<T extends AnyEntity>(
  target: Class<T>,
  metadata: EntityMetadata,
) {
  Reflect.defineMetadata(ENTITY_METADATA, metadata, target);
}

export function getEntityMetadata<T extends AnyEntity>(target: Class<T>): EntityMetadata {
  return Reflect.getMetadata(ENTITY_METADATA, target);
}
