import { AnyEntity, Entity, EntityConstructorParams, GetEntityProps } from '#core/entity';
import { Class } from 'type-fest';

export type EntityClass<T extends AnyEntity> = Omit<
  typeof Entity<GetEntityProps<T>>,
  'constructor'
> &
  Class<T, EntityConstructorParams<T>>;
