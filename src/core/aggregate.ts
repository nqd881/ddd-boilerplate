import { AggregateClass } from '#types/aggregate.type';
import { AGGREGATE_TYPE } from 'src/decorators';
import { v4 } from 'uuid';
import { AnyDomainEvent } from './domain-event';
import { Entity, GetEntityProps } from './entity';
import 'reflect-metadata';
export abstract class Aggregate<P> extends Entity<P> {
  protected _originalVersion: number;
  protected _events: AnyDomainEvent[];

  // loaded from repo or new instance
  protected _loaded: boolean;

  constructor(type: string, id: string, props: P, originalVersion: number, loaded: boolean) {
    super(type, id, props);

    if (originalVersion < 0) throw new Error('Version must be set with non-negative number');

    this._originalVersion = originalVersion;
    this._events = [];
    this._loaded = loaded;

    if (this.isNew()) {
      this.mark();
    }
  }

  static isAggregate(obj: object): obj is AnyAggregate {
    return obj instanceof Aggregate;
  }

  static getAggregateType<T extends AnyAggregate>(this: AggregateClass<T>): string {
    return Reflect.getMetadata(AGGREGATE_TYPE, this) ?? this.name;
  }

  static initAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props: GetEntityProps<T>,
    id: string = v4(),
  ) {
    const aggregateType = this.getAggregateType();

    return new this(aggregateType, id, props, 0, false);
  }

  static loadAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    id: string,
    props: GetEntityProps<T>,
    version: number,
  ) {
    const aggregateType = this.getAggregateType();

    return new this(aggregateType, id, props, version, true);
  }

  hasUnpublishedEvents() {
    return Boolean(this.events.length);
  }

  protected recordEvent(event: AnyDomainEvent) {
    this._events.push(event);
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

  get version() {
    if (this.hasChanged()) return this._originalVersion + 1;

    return this._originalVersion;
  }

  get loaded() {
    return this._loaded;
  }
}

export type AnyAggregate = Aggregate<any>;

export type AggregateConstructorParamsWithProps<P> = ConstructorParameters<typeof Aggregate<P>>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<GetEntityProps<T>>;
