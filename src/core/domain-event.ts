import { DomainEventMetadata } from '#metadata/domain-event.metadata';
import { DomainEventClass } from '#types/domain-event.type';
import _ from 'lodash';
import { Class } from 'type-fest';
import { v4 } from 'uuid';

export class DomainEvent<P> {
  private readonly _id: string;
  private readonly _aggregateId: string;
  private readonly _timestamp: number;

  protected readonly _props: P;

  constructor(id: string, aggregateId: string, timestamp: number, props: P) {
    this._id = id;
    this._aggregateId = aggregateId;
    this._timestamp = timestamp;
    this._props = props;
  }

  getDomainEventMetadata() {
    return DomainEventMetadata.getDomainEventMetadata(this.constructor as Class<DomainEvent<P>>);
  }

  static newEvent<T extends AnyDomainEvent>(
    this: DomainEventClass<T>,
    aggregateId: string,
    props: GetDomainEventProps<T>,
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

  getProps() {
    return _.cloneDeep(this._props);
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
