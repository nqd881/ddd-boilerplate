import {
  AnyDomainEvent,
  DomainEvent,
  DomainEventConstructorParams,
  GetDomainEventProps,
} from '#core/domain-event';
import { Class } from 'type-fest';

export type DomainEventClass<T extends AnyDomainEvent> = Class<T, DomainEventConstructorParams<T>> &
  typeof DomainEvent<GetDomainEventProps<T>>;
