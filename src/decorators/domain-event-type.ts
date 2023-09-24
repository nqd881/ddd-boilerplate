import { AnyDomainEvent } from '#core/domain-event';
import { DomainEventMetadata } from '#metadata/domain-event.metadata';
import { DomainEventClass } from '#types/domain-event.type';

export const DomainEventType = <T extends AnyDomainEvent>(eventType?: string) => {
  return <U extends DomainEventClass<T>>(target: U) => {
    DomainEventMetadata.defineDomainEventMetadata(
      target,
      new DomainEventMetadata(eventType ?? target.name),
    );
  };
};
