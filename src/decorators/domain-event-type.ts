import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { defineDomainEventMetadata } from '#metadata/domain-event.metadata';
import { PropsOptions } from '#metadata/props.metadata';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const DomainEventType = <T extends AnyDomainEvent>(
  propsClass: Class<GetProps<T>>,
  eventType?: string,
  options?: PropsOptions,
) => {
  return <U extends DomainEventClass<T>>(target: U) => {
    defineDomainEventMetadata(target, { eventType: eventType ?? target.name });

    return PropsEnvelopeType(propsClass, options)(target);
  };
};
