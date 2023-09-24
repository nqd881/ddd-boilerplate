import {
  AnyEntity,
  Entity,
  EntityConstructorParams,
  EntityProps,
  GetEntityProps,
} from '#core/entity';
import { Class } from 'type-fest';

export type EntityClass<T extends AnyEntity> = Omit<
  typeof Entity<GetEntityProps<T>>,
  'constructor'
> &
  Class<T, EntityConstructorParams<T>>;

export type EntityClassWithProps<P extends EntityProps> = EntityClass<Entity<P>>;
