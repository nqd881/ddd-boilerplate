import { AnyDomainEventClass } from '#types/domain-event.type';
import { DOMAIN_EVENT_TYPE } from './constants';
import { Registry } from './registry';

export const DomainEventRegistry = new Registry<AnyDomainEventClass>();

export const defineDomainEventType = (target: object, eventType: string) => {
  Reflect.defineMetadata(DOMAIN_EVENT_TYPE, eventType, target);
};

export const getDomainEventType = (target: object): string => {
  return Reflect.getMetadata(DOMAIN_EVENT_TYPE, target);
};
