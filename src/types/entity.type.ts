import { AnyEntity, Entity, EntityConstructorParams } from '#core/entity';
import { GetProps, Props } from '#core/props-envelope';
import { Class } from 'type-fest';

export type EntityClass<T extends AnyEntity> = Omit<typeof Entity<GetProps<T>>, 'constructor'> &
  Class<T, EntityConstructorParams<T>>;

export type EntityClassWithProps<P extends Props> = EntityClass<Entity<P>>;
