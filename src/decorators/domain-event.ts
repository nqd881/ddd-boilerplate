import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { DomainEventRegistry, defineDomainEventType } from '#metadata/domain-event';
import { definePropsClass } from '#metadata/props';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';

export const DomainEvent = <E extends AnyDomainEvent>(
  propsClass: Class<GetProps<E>>,
  eventType?: string,
) => {
  return <U extends DomainEventClass<E>>(target: U) => {
    eventType = eventType ?? target.name;

    definePropsClass(target.prototype, propsClass);
    defineDomainEventType(target.prototype, eventType ?? target.name);

    DomainEventRegistry.register(eventType, target);
  };
};
