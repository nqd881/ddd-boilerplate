import { AnyEntity, EntityProps, GetEntityProps } from '#core/entity';
import { Class } from 'type-fest';
import { ENTITY_METADATA } from './constants';

export class EntityMetadata<P extends EntityProps> {
  constructor(public readonly entityType: string, public readonly propsClass: Class<P>) {}

  static defineEntityMetadata<T extends AnyEntity>(
    target: Class<T>,
    metadata: EntityMetadata<GetEntityProps<T>>,
  ) {
    Reflect.defineMetadata(ENTITY_METADATA, metadata, target);
  }

  static getEntityMetadata<T extends AnyEntity>(
    target: Class<T>,
  ): EntityMetadata<GetEntityProps<T>> {
    return Reflect.getMetadata(ENTITY_METADATA, target);
  }
}
