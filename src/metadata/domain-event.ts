import { DOMAIN_EVENT_TYPE } from './constants';

export const defineDomainEventType = (target: object, eventType: string) => {
  Reflect.defineMetadata(DOMAIN_EVENT_TYPE, eventType, target);
};

export const getDomainEventType = (target: object): string => {
  return Reflect.getMetadata(DOMAIN_EVENT_TYPE, target);
};
