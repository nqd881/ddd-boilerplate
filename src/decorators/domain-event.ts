import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { defineDomainEventType } from '#metadata/domain-event';
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';

export const DomainEvent = <E extends AnyDomainEvent>(
  propsClass: Class<GetProps<E>>,
  eventType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends DomainEventClass<E>>(target: U) => {
    definePropsMetadata(target, { propsClass, propsOptions });
    defineDomainEventType(target, eventType ?? target.name);
  };
};
