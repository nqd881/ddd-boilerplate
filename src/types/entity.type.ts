import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';
import { AnyEntity, EntityBase } from '#core/entity';

export type EntityConstructorParamsWithProps<P extends object> = ConstructorParameters<
  typeof EntityBase<P>
>;

export type EntityConstructorParams<T extends AnyEntity> = EntityConstructorParamsWithProps<
  GetProps<T>
>;

export type EntityClass<T extends AnyEntity> = Class<T, EntityConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof EntityBase<GetProps<T>>>;

export type EntityClassWithProps<P extends object> = EntityClass<EntityBase<P>>;
