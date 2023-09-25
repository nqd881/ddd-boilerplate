import { AggregateClass } from '#types/aggregate.type';
import { DomainEventClass } from '#types/domain-event.type';
import { v4 } from 'uuid';
import { AnyDomainEvent } from './domain-event';
import { Entity } from './entity';
import { GetProps, Props } from './props-envelope';

export abstract class Aggregate<P extends Props> extends Entity<P> {
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

  static initAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props: GetProps<T>,
    id: string = v4(),
  ) {
    return new this(id, props, 0, false);
  }

  static loadAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    id: string,
    props: GetProps<T>,
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
    props: GetProps<T>,
  ): void;
  protected recordEvent<T extends AnyDomainEvent>(
    param1: T | DomainEventClass<T>,
    param2?: GetProps<T>,
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

export type AggregateConstructorParamsWithProps<P extends Props> = ConstructorParameters<
  typeof Aggregate<P>
>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<GetProps<T>>;
