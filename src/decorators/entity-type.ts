import { AnyEntity, GetEntityProps } from '#core/entity';
import { EntityMetadata } from '#metadata/entity.metadata';
import { EntityClass } from '#types/entity.type';
import 'reflect-metadata';
import { Class } from 'type-fest';

export const EntityType = <T extends AnyEntity>(
  propsClass: Class<GetEntityProps<T>>,
  entityType?: string,
) => {
  return <U extends EntityClass<T>>(target: U) => {
    EntityMetadata.defineEntityMetadata(
      target,
      new EntityMetadata(entityType ?? target.name, propsClass),
    );
  };
};
