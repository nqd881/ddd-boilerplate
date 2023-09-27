import { AnyEntity, Entity } from '#core/entity';
import { GetProps, Props } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type EntityConstructorParamsWithProps<P extends Props> = ConstructorParameters<
  typeof Entity<P>
>;

export type EntityConstructorParams<T extends AnyEntity> = EntityConstructorParamsWithProps<
  GetProps<T>
>;

export type EntityClass<T extends AnyEntity> = Class<T, EntityConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof Entity<GetProps<T>>>;

export type EntityClassWithProps<P extends Props> = EntityClass<Entity<P>>;
