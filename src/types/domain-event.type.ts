import { AnyDomainEvent, DomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type DomainEventConstructorParamsWithProps<Props extends object> = ConstructorParameters<
  typeof DomainEvent<Props>
>;

export type DomainEventConstructorParams<T extends AnyDomainEvent> =
  DomainEventConstructorParamsWithProps<GetProps<T>>;

export type DomainEventClass<T extends AnyDomainEvent> = Class<T, DomainEventConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof DomainEvent<GetProps<T>>>;

export type DomainEventClassWithProps<P extends object> = DomainEventClass<DomainEvent<P>>;
