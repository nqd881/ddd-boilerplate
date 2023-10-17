import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';
import { AnyDomainEvent, DomainEventBase } from '#core/domain-event';

export type DomainEventConstructorParamsWithProps<P extends object> = ConstructorParameters<
  typeof DomainEventBase<P>
>;

export type DomainEventConstructorParams<T extends AnyDomainEvent> =
  DomainEventConstructorParamsWithProps<GetProps<T>>;

export type DomainEventClass<T extends AnyDomainEvent> = Class<T, DomainEventConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof DomainEventBase<GetProps<T>>>;

export type DomainEventClassWithProps<P extends object> = DomainEventClass<DomainEventBase<P>>;

export type AnyDomainEventClass = DomainEventClass<AnyDomainEvent>;
