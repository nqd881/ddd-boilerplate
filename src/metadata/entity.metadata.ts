import { AnyEntity } from '#core/entity';
import { Class } from 'type-fest';
import { ENTITY_METADATA } from './constants';

export class EntityMetadata {
  constructor(public readonly entityType: string) {}

  static defineEntityMetadata<T extends AnyEntity>(target: Class<T>, metadata: EntityMetadata) {
    Reflect.defineMetadata(ENTITY_METADATA, metadata, target);
  }

  static getEntityMetadata<T extends AnyEntity>(target: Class<T>): EntityMetadata {
    return Reflect.getMetadata(ENTITY_METADATA, target);
  }
}
