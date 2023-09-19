import { AnyDomainEvent } from '#core/domain-event';

export interface IDomainEventSubscriber<E extends AnyDomainEvent> {
  handleEvent(event: E): any;
}
