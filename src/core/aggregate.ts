import { AggregateClass } from '#types/aggregate.type';
import 'reflect-metadata';
import { v4 } from 'uuid';
import { AnyDomainEvent, GetDomainEventProps } from './domain-event';
import { Entity, EntityProps, GetEntityProps } from './entity';
import { Class } from 'type-fest';
import { AggregateMetadata } from '#metadata/aggregate.metadata';
import { DomainEventClass } from '#types/domain-event.type';
export abstract class Aggregate<P extends EntityProps> extends Entity<P> {
  protected _originalVersion: number;
  protected _events: AnyDomainEvent[];

  // loaded from repo or new instance
  protected _loaded: boolean;

  constructor(id: string, props: P, originalVersion: number, loaded: boolean) {
    super(id, props);

    if (originalVersion < 0) throw new Error('Version must be set with non-negative number');

    this._originalVersion = originalVersion;
    this._events = [];
    this._loaded = loaded;
  }

  static isAggregate(obj: object): obj is AnyAggregate {
    return obj instanceof Aggregate;
  }

  getAggregateMetadata() {
    return AggregateMetadata.getAggregateMetadata(this.constructor as Class<Aggregate<P>>);
  }

  static initAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props: GetEntityProps<T>,
    id: string = v4(),
  ) {
    return new this(id, props, 0, false);
  }

  static loadAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    id: string,
    props: GetEntityProps<T>,
    version: number,
  ) {
    return new this(id, props, version, true);
  }

  hasEvents() {
    return Boolean(this.events.length);
  }

  protected recordEvent<T extends AnyDomainEvent>(event: T): void;
  protected recordEvent<T extends AnyDomainEvent>(
    eventClass: DomainEventClass<T>,
    props: GetDomainEventProps<T>,
  ): void;
  protected recordEvent<T extends AnyDomainEvent>(
    param1: T | DomainEventClass<T>,
    param2?: GetDomainEventProps<T>,
  ): void {
    const newEvent = typeof param1 === 'function' ? param1.newEvent(this.id, param2!) : param1;

    this._events.push(newEvent);
  }

  clearEvents() {
    this._events = [];
  }

  // mean has no change was saved before
  isNew() {
    return this._originalVersion === 0 && !this._loaded;
  }

  get events() {
    return this._events;
  }

  get originalVersion() {
    return this._originalVersion;
  }

  get loaded() {
    return this._loaded;
  }

  get nextVersion() {
    if (this.isNew()) return this._originalVersion;

    return this._originalVersion + 1;
  }
}

export type AnyAggregate = Aggregate<any>;

export type AggregateConstructorParamsWithProps<Props extends EntityProps> = ConstructorParameters<
  typeof Aggregate<Props>
>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<GetEntityProps<T>>;
