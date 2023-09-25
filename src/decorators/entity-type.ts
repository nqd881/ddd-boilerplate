import { AnyEntity } from '#core/entity';
import { GetProps } from '#core/props-envelope';
import { EntityMetadata } from '#metadata/entity.metadata';
import { EntityClass } from '#types/entity.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const EntityType = <T extends AnyEntity>(
  propsClass: Class<GetProps<T>>,
  entityType?: string,
) => {
  return <U extends EntityClass<T>>(target: U) => {
    EntityMetadata.defineEntityMetadata(target, new EntityMetadata(entityType ?? target.name));

    return PropsEnvelopeType(propsClass)(target);
  };
};
