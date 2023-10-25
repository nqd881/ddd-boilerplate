import { ToObject } from '#decorators/to-object';
import { getDomainEventType } from '#metadata/domain-event';
import { DomainEventClass } from '#types/domain-event.type';
import { generateUUIDWithPrefix } from '#utils/id';
import { Type } from 'class-transformer';
import { GetProps, PropsEnvelope } from './props-envelope';

export interface IDomainEventMetadata {
  id: string;
  aggregateInfo: DomainEventAggregateInfo;
  timestamp: number;
  correlationId?: string;
  causationId?: string;
}
@ToObject()
export class DomainEventAggregateInfo {
  readonly type: string;
  readonly id: string;
  readonly version: number;
}

export class DomainEventMetadata implements IDomainEventMetadata {
  private _id: string;

  @Type(() => DomainEventAggregateInfo)
  private _aggregateInfo: DomainEventAggregateInfo;

  private _timestamp: number;
  private _correlationId?: string;
  private _causationId?: string;

  constructor(metadata: IDomainEventMetadata) {
    if (metadata) {
      this._id = metadata.id;
      this._aggregateInfo = metadata.aggregateInfo;
      this._timestamp = metadata.timestamp;
      this._correlationId = metadata.correlationId;
      this._causationId = metadata.causationId;
    }
  }

  @ToObject()
  get id() {
    return this._id;
  }

  @ToObject()
  get aggregateInfo() {
    return this._aggregateInfo;
  }

  @ToObject()
  get timestamp() {
    return this._timestamp;
  }

  @ToObject()
  get correlationId() {
    return this._correlationId;
  }

  @ToObject()
  get causationId() {
    return this._causationId;
  }

  setCorrelationId(correlationId: string) {
    if (!this?._correlationId) this._correlationId = correlationId;
  }

  setCausationId(causationId: string) {
    if (!this?._causationId) this._causationId = causationId;
  }
}

export class DomainEventBase<P extends object> extends PropsEnvelope<DomainEventMetadata, P> {
  constructor(metadata: IDomainEventMetadata, props: P) {
    super(new DomainEventMetadata(metadata), props, true);
  }

  static newEvent<E extends AnyDomainEvent>(
    this: DomainEventClass<E>,
    aggregateInfo: DomainEventAggregateInfo,
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
        aggregateInfo,
        timestamp: Date.now(),
        correlationId,
        causationId,
      },
      props,
    );
  }

  @ToObject({ name: 'eventType', isMetadata: true })
  getEventType() {
    const prototype = Object.getPrototypeOf(this);

    return getDomainEventType(prototype);
  }

  get id() {
    return this.metadata.id;
  }

  get aggregateInfo() {
    return this.metadata.aggregateInfo;
  }

  get timestamp() {
    return this.metadata.timestamp;
  }

  get correlationId() {
    return this.metadata.correlationId;
  }

  get causationId() {
    return this.metadata.causationId;
  }
}

export type AnyDomainEvent = DomainEventBase<any>;
