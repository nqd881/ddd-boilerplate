import { getDomainEventType } from '#metadata/domain-event';
import { DomainEventClass } from '#types/domain-event.type';
import { generateUUIDWithPrefix } from 'src/utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

export class DomainEventBase<P extends object> extends PropsEnvelope<P> {
  private readonly _id: string;
  private readonly _aggregateId: string;
  private readonly _timestamp: number;
  private _correlationId?: string;

  constructor(
    id: string,
    aggregateId: string,
    timestamp: number,
    props: P,
    correlationId?: string,
  ) {
    super(props, true);

    this._id = id;
    this._aggregateId = aggregateId;
    this._timestamp = timestamp;
    this._correlationId = correlationId;
  }

  static newEvent<E extends AnyDomainEvent>(
    this: DomainEventClass<E>,
    aggregateId: string,
    props: GetProps<E>,
    id = generateUUIDWithPrefix(getDomainEventType(this)),
    correlationId?: string,
  ) {
    return new this(id, aggregateId, Date.now(), props, correlationId);
  }

  setCorrelationId(correlationId: string) {
    if (this._correlationId) return;

    this._correlationId = correlationId;
  }

  get id() {
    return this._id;
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
