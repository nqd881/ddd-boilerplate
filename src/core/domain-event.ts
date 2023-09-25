import { DomainEventClass } from '#types/domain-event.type';
import { v4 } from 'uuid';
import { GetProps, PropsEnvelope } from './props-envelope';

export abstract class DomainEvent<P extends object> extends PropsEnvelope<P> {
  private readonly _id: string;
  private readonly _aggregateId: string;
  private readonly _timestamp: number;

  constructor(id: string, aggregateId: string, timestamp: number, props: P) {
    super(props, true);

    this._id = id;
    this._aggregateId = aggregateId;
    this._timestamp = timestamp;
  }

  static newEvent<T extends AnyDomainEvent>(
    this: DomainEventClass<T>,
    aggregateId: string,
    props: GetProps<T>,
    id: string = v4(),
  ) {
    return new this(id, aggregateId, Date.now(), props);
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
}

export type AnyDomainEvent = DomainEvent<any>;

export type DomainEventConstructorParamsWithProps<Props extends object> = ConstructorParameters<
  typeof DomainEvent<Props>
>;

export type DomainEventConstructorParams<T extends AnyDomainEvent> =
  DomainEventConstructorParamsWithProps<GetProps<T>>;
