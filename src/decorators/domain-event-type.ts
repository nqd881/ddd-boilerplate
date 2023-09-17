import { AnyDomainEvent } from '#core/domain-event';
import { DomainEventClass } from '#types/domain-event.type';
import { DOMAIN_EVENT_AGGREGATE_TYPE, DOMAIN_EVENT_TYPE } from './constants';

export const DomainEventType = <T extends AnyDomainEvent>(
  aggregateType: string,
  eventType?: string,
) => {
  return <U extends DomainEventClass<T>>(target: U) => {
    Reflect.defineMetadata(DOMAIN_EVENT_AGGREGATE_TYPE, aggregateType, target);
    Reflect.defineMetadata(DOMAIN_EVENT_TYPE, eventType, target);
  };
};
