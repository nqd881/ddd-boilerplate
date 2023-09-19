import { AnyDomainEvent } from '#core/domain-event';
import { IDomainEventSubscriber } from './domain-event-subscriber.interface';

export interface IDomainEventPublisher {
  subscribe<E extends AnyDomainEvent>(subscriber: IDomainEventSubscriber<E>): void;
  removeSubscriber<E extends AnyDomainEvent>(subscriber: IDomainEventSubscriber<E>): void;
  publish<E extends AnyDomainEvent>(event: E): void;
}
