import { ToObject } from '#decorators/to-object';
import { getDomainEventType } from '#metadata/domain-event';
import { DomainEventClass } from '#types/domain-event.type';
import { generateUUIDWithPrefix } from '#utils/id';
import { Type } from 'class-transformer';
import { GetProps, PropsEnvelope } from './props-envelope';

@ToObject()
export class DomainEventAggregate {
  type: string;
  id: string;
  version: number;
}

@ToObject()
export class DomainEventMetadata {
  id: string;

  @Type(() => DomainEventAggregate)
  aggregate: DomainEventAggregate;

  timestamp: number;
  correlationId?: string;
  causationId?: string;
}
export class DomainEventBase<P extends object> extends PropsEnvelope<DomainEventMetadata, P> {
  constructor(metadata: DomainEventMetadata, props: P) {
    super(metadata, props, true);
  }

  static newEvent<E extends AnyDomainEvent>(
    this: DomainEventClass<E>,
    aggregate: DomainEventAggregate,
    props: GetProps<E>,
    id?: string,
    correlationId?: string,
    causationId?: string,
  ) {
    const eventType = getDomainEventType(this.prototype);

    id = id ?? generateUUIDWithPrefix(eventType);

    return new this(
      {
        id,
        aggregate,
        timestamp: Date.now(),
        correlationId,
        causationId,
      },
      props,
    );
  }

  @ToObject({ name: 'eventType', isMetadata: true })
  getEventType() {
    return getDomainEventType(Object.getPrototypeOf(this));
  }

  get id() {
    return this.metadata.id;
  }

  get aggregate() {
    return this.metadata.aggregate;
  }

  get timestamp() {
    return this.metadata.timestamp;
  }

  get correlationId() {
    return this.metadata?.correlationId;
  }

  get causationId() {
    return this.metadata?.causationId;
  }
}

export type AnyDomainEvent = DomainEventBase<any>;
