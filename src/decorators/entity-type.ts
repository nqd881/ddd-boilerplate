import { AnyEntity } from '#core/entity';
import { GetProps } from '#core/props-envelope';
import { defineEntityMetadata } from '#metadata/entity.metadata';
import { PropsOptions } from '#metadata/props.metadata';
import { EntityClass } from '#types/entity.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const EntityType = <T extends AnyEntity>(
  propsClass: Class<GetProps<T>>,
  entityType?: string,
  options?: PropsOptions,
) => {
  return <U extends EntityClass<T>>(target: U) => {
    defineEntityMetadata(target, {
      entityType: entityType ?? target.name,
    });

    return PropsEnvelopeType(propsClass, options)(target);
  };
};
