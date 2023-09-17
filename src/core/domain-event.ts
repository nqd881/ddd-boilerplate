import { DomainEventClass } from '#types/domain-event.type';
import 'reflect-metadata';
import { DOMAIN_EVENT_AGGREGATE_TYPE, DOMAIN_EVENT_TYPE } from 'src/decorators';
import { v4 } from 'uuid';

export interface DomainEventMetadata {
  eventType: string;
  aggregateType: string;
}

export class DomainEvent<P> {
  public readonly metadata: Readonly<DomainEventMetadata>;
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly timestamp: number;
  public readonly props: Readonly<P>;

  constructor(
    metadata: DomainEventMetadata,
    id: string,
    aggregateId: string,
    timestamp: number,
    props: P,
  ) {
    this.metadata = metadata;
    this.id = id;
    this.aggregateId = aggregateId;
    this.timestamp = timestamp;
    this.props = props;
  }

  static getDomainEventType<T extends AnyDomainEvent>(this: DomainEventClass<T>) {
    return Reflect.getMetadata(DOMAIN_EVENT_TYPE, this) ?? this.name;
  }

  static getDomainEventAggregateType<T extends AnyDomainEvent>(this: DomainEventClass<T>) {
    return Reflect.getMetadata(DOMAIN_EVENT_AGGREGATE_TYPE, this);
  }

  static newEvent<T extends AnyDomainEvent>(
    this: DomainEventClass<T>,
    aggregateId: string,
    props: GetDomainEventProps<T>,
    id: string = v4(),
  ) {
    const metadata: DomainEventMetadata = {
      aggregateType: this.getDomainEventAggregateType(),
      eventType: this.getDomainEventType(),
    };

    return new this(metadata, id, aggregateId, Date.now(), props);
  }
}

export type AnyDomainEvent = DomainEvent<any>;

export type GetDomainEventProps<T extends AnyDomainEvent> = T extends DomainEvent<infer P>
  ? P
  : never;

export type DomainEventConstructorParamsWithProps<Props> = ConstructorParameters<
  typeof DomainEvent<Props>
>;

export type DomainEventConstructorParams<T extends AnyDomainEvent> =
  DomainEventConstructorParamsWithProps<GetDomainEventProps<T>>;
