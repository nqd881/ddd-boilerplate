import { ToObject } from '#decorators/to-object';
import { getDomainEventType } from '#metadata/domain-event';
import { DomainEventClass } from '#types/domain-event.type';
import { generateUUIDWithPrefix } from 'src/utils';
import { GetProps, PropsEnvelopeWithId } from './props-envelope';

export class DomainEventBase<P extends object> extends PropsEnvelopeWithId<P> {
  @ToObject()
  private readonly _aggregateId: string;

  @ToObject()
  private readonly _timestamp: number;

  @ToObject()
  private _correlationId?: string;

  constructor(
    id: string,
    aggregateId: string,
    timestamp: number,
    props: P,
    correlationId?: string,
  ) {
    super(id, props, true);

    this._aggregateId = aggregateId;
    this._timestamp = timestamp;
    this._correlationId = correlationId;
  }

  static newEvent<E extends AnyDomainEvent>(
    this: DomainEventClass<E>,
    aggregateId: string,
    props: GetProps<E>,
    id?: string,
    correlationId?: string,
  ) {
    id = id ?? generateUUIDWithPrefix(getDomainEventType(this.prototype));

    return new this(id, aggregateId, Date.now(), props, correlationId);
  }

  getEventType() {
    return getDomainEventType(Object.getPrototypeOf(this));
  }

  setCorrelationId(correlationId: string) {
    if (this._correlationId) return;

    this._correlationId = correlationId;
  }

  @ToObject({ name: '_eventType' })
  get eventType() {
    return this.getEventType();
  }

  get aggregateId() {
    return this._aggregateId;
  }

  get timestamp() {
    return this._timestamp;
  }

  get correlationId() {
    return this._correlationId;
  }
}

export type AnyDomainEvent = DomainEventBase<any>;
