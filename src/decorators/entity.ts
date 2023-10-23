import { AnyEntity, EntityMetadata } from '#core/entity';
import { GetProps } from '#core/props-envelope';
import { EntityRegistry, defineEntityType } from '#metadata/entity';
import { defineMetadataClass } from '#metadata/metadata';
import { definePropsClass } from '#metadata/props';
import { EntityClass } from '#types/entity.type';
import { Class } from 'type-fest';

export const Entity = <T extends AnyEntity>(
  propsClass: Class<GetProps<T>>,
  entityType?: string,
) => {
  return <U extends EntityClass<T>>(target: U) => {
    entityType = entityType ?? target.name;

    defineMetadataClass(target.prototype, EntityMetadata);
    definePropsClass(target.prototype, propsClass);
    defineEntityType(target.prototype, entityType);

    EntityRegistry.register(entityType, target);
  };
};
