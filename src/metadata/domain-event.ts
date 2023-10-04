import { AnyDomainEvent } from '#core/domain-event';
import { Class } from 'type-fest';
import { DOMAIN_EVENT_TYPE } from './constants';

export const defineDomainEventType = <T extends AnyDomainEvent>(
  target: Class<T>,
  eventType: string,
) => {
  Reflect.defineMetadata(DOMAIN_EVENT_TYPE, eventType, target);
};

export const getDomainEventType = <T extends AnyDomainEvent>(target: Class<T>): string => {
  return Reflect.getMetadata(DOMAIN_EVENT_TYPE, target);
};
