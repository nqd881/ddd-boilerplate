import { AnyDomainEvent, DomainEventMetadata } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { DomainEventRegistry, defineDomainEventType } from '#metadata/domain-event';
import { defineMetadataClass } from '#metadata/metadata';
import { PropsOptions, definePropsClass } from '#metadata/props';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';

export const DomainEvent = <E extends AnyDomainEvent>(
  propsClass: Class<GetProps<E>>,
  eventType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends DomainEventClass<E>>(target: U) => {
    eventType = eventType ?? target.name;

    defineMetadataClass(target.prototype, DomainEventMetadata);
    definePropsClass(target.prototype, propsClass);
    defineDomainEventType(target.prototype, eventType ?? target.name);

    DomainEventRegistry.register(eventType, target);
  };
};
