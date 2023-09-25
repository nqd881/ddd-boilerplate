import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';
import { DomainEventMetadata } from '#metadata/domain-event.metadata';

export const DomainEventType = <T extends AnyDomainEvent>(
  propsClass: Class<GetProps<T>>,
  eventType?: string,
) => {
  return <U extends DomainEventClass<T>>(target: U) => {
    DomainEventMetadata.defineDomainEventMetadata(
      target,
      new DomainEventMetadata(eventType ?? target.name),
    );

    return PropsEnvelopeType(propsClass)(target);
  };
};
