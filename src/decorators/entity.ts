import { AnyEntity } from '#core/entity';
import { GetProps } from '#core/props-envelope';
import { defineEntityType } from '#metadata/entity';
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { EntityClass } from '#types/entity.type';
import { Class } from 'type-fest';

export const Entity = <T extends AnyEntity>(
  propsClass: Class<GetProps<T>>,
  entityType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends EntityClass<T>>(target: U) => {
    definePropsMetadata(target.prototype, { propsClass, propsOptions });
    defineEntityType(target.prototype, entityType ?? target.name);
  };
};
