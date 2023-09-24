import { AnyDomainEvent } from '#core/domain-event';
import { Class } from 'type-fest';
import { DOMAIN_EVENT_METADATA } from './constants';

export class DomainEventMetadata {
  constructor(public readonly eventType: string) {}

  static defineDomainEventMetadata<T extends AnyDomainEvent>(
    target: Class<T>,
    metadata: DomainEventMetadata,
  ) {
    Reflect.defineMetadata(DOMAIN_EVENT_METADATA, metadata, target);
  }

  static getDomainEventMetadata<T extends AnyDomainEvent>(target: Class<T>): DomainEventMetadata {
    return Reflect.getMetadata(DOMAIN_EVENT_METADATA, target);
  }
}
