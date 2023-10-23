import { AnyDomainEvent } from '#core/domain-event';
import { Class } from 'type-fest';
import { DOMAIN_EVENT_TYPE } from './constants';
import { Registry } from './registry';

export const DomainEventRegistry = new Registry<Class<AnyDomainEvent>>();

export const defineDomainEventType = (target: object, eventType: string) => {
  Reflect.defineMetadata(DOMAIN_EVENT_TYPE, eventType, target);
};

export const getDomainEventType = (target: object): string => {
  return Reflect.getMetadata(DOMAIN_EVENT_TYPE, target);
};
