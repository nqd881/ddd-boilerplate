import { ToObject } from '#decorators/to-object';
import {
  getAggregateCommandHandler,
  getAggregateEventApplier,
  getAggregateType,
} from '#metadata/aggregate';
import { AggregateClass } from '#types/aggregate.type';
import { DomainEventClass } from '#types/domain-event.type';
import _ from 'lodash';
import { deepFreeze, generateUUIDWithPrefix } from 'src/utils';
import { AnyCommand } from './command';
import { AnyDomainEvent } from './domain-event';
import { EntityBase } from './entity';
import {
  CommandHandlerNotFoundError,
  EventApplierNotFoundError,
  NonNegativeVersionError,
} from './errors/aggregate';
import { GetProps } from './props-envelope';
import { toArray } from '#utils/to-array';

export class AggregateBase<P extends object> extends EntityBase<P> {
  @ToObject()
  protected readonly _originalVersion: number;

  protected _events: AnyDomainEvent[] = [];
  protected _snapshots: (typeof this)[] = [];

  // loaded from repo or new instance
  protected _loaded: boolean;

  constructor(id: string, originalVersion: number, loaded: boolean, props?: P) {
    super(id, props);

    if (originalVersion < 0) throw new NonNegativeVersionError();

    this._originalVersion = originalVersion;
    this._loaded = loaded;
  }

  static isAggregate(obj: object): obj is AggregateBase<any> {
    return obj instanceof AggregateBase;
  }

  static initAggregate<A extends AnyAggregate>(
    this: AggregateClass<A>,
    props?: GetProps<A>,
    id?: string,
  ) {
    id = id ?? generateUUIDWithPrefix(getAggregateType(this.prototype));

    return new this(id, 0, false, props);
  }

  static loadAggregate<A extends AnyAggregate>(
    this: AggregateClass<A>,
    id: string,
    originalVersion: number,
    props: GetProps<A>,
    historyEvents?: AnyDomainEvent[],
  ) {
    const aggregate = new this(id, originalVersion, true, props);

    aggregate.applyEvents(historyEvents ?? [], true);

    return aggregate;
  }

  init(props: P): void {
    super.init(props);

    this.snap();
  }

  getAggregateType() {
    return getAggregateType(Object.getPrototypeOf(this));
  }

  hasEvents() {
    return Boolean(this.events.length);
  }

  clearEvents() {
    this._events = [];
  }

  newEvent<E extends AnyDomainEvent>(eventClass: DomainEventClass<E>, props: GetProps<E>) {
    return eventClass.newEvent(
      { type: this.getAggregateType(), id: this.id, version: this.lastEventVersion + 1 },
      props,
    );
  }

  protected recordEvent<E extends AnyDomainEvent>(event: E): void;
  protected recordEvent<E extends AnyDomainEvent>(
    eventClass: DomainEventClass<E>,
    props: GetProps<E>,
  ): void;
  protected recordEvent<E extends AnyDomainEvent>(
    param1: E | DomainEventClass<E>,
    param2?: GetProps<E>,
  ): void {
    const newEvent = typeof param1 === 'function' ? this.newEvent(param1, param2!) : param1;

    if (!this._events) this._events = [];

    this._events.push(newEvent);
  }

  // mean has no change was saved before
  isNew() {
    return this._originalVersion === 0 && !this._loaded;
  }

  @ToObject({ name: '_aggregateType' })
  get aggregateType() {
    return this.getAggregateType();
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

  @ToObject({ name: '_nextVersion' })
  get nextVersion() {
    if (this.isNew()) return this._originalVersion;

    return this._originalVersion + 1;
  }

  @ToObject({ name: '_eventVersion' })
  get lastEventVersion() {
    const lastEvent = this._events.at(-1);

    if (lastEvent) return lastEvent.aggregate.version;

    return -1;
  }

  getEventApplier(eventType: string) {
    const prototype = Object.getPrototypeOf(this);

    const eventApplier = getAggregateEventApplier(prototype, eventType);

    if (eventApplier) return eventApplier.bind(this);

    return null;
  }

  applyEvent<E extends AnyDomainEvent>(event: E, fromHistory = false) {
    const eventType = event.eventType;

    const applier = this.getEventApplier(eventType);

    if (!applier) throw new EventApplierNotFoundError(eventType);

    applier(event);

    if (!fromHistory) this.recordEvent(event);
  }

  applyEvents(events: AnyDomainEvent[], fromHistory = true) {
    events.forEach((event) => {
      this.applyEvent(event, fromHistory);
    });
  }

  getCommandHandler(commandType: string) {
    const prototype = Object.getPrototypeOf(this);

    const commandHandler = getAggregateCommandHandler(prototype, commandType);

    if (commandHandler) return commandHandler.bind(this);

    return null;
  }

  processCommand<C extends AnyCommand>(command: C) {
    const commandType = command.commandType;

    const handler = this.getCommandHandler(commandType);

    if (!handler) throw new CommandHandlerNotFoundError(commandType);

    const events = toArray(handler(command));

    events.forEach((event) => {
      if (command.correlationId) event.setCorrelationId(command.correlationId);

      this.applyEvent(event);
    });

    return events;
  }

  addSnapshot(snapshot: typeof this) {
    if (!this._snapshots) this._snapshots = [];

    this._snapshots.push(snapshot);
  }

  snap() {
    const snapshot = _.cloneDeep(this);

    deepFreeze(snapshot);

    this.addSnapshot(snapshot);

    return snapshot;
  }

  getSnapshots() {
    return this._snapshots;
  }
}

export type AggregateEventApplier<E extends AnyDomainEvent> = (event: E) => void;

export type AggregateCommandHandler<
  C extends AnyCommand,
  E extends AnyDomainEvent = AnyDomainEvent,
> = (command: C) => E | E[];

export type AnyAggregate = AggregateBase<any>;
