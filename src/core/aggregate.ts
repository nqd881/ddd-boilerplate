import { ToObject } from '#decorators/to-object';
import {
  getAggregateCommandHandler,
  getAggregateEventApplier,
  getAggregateType,
} from '#metadata/aggregate';
import { AggregateClass } from '#types/aggregate.type';
import { DomainEventClass } from '#types/domain-event.type';
import { toArray } from '#utils/to-array';
import _ from 'lodash';
import { deepFreeze, generateUUIDWithPrefix } from 'src/utils';
import { AnyCommand } from './command';
import { AnyDomainEvent } from './domain-event';
import { EntityBase } from './entity';
import {
  CommandHandlerNotFoundError,
  EventApplierNotFoundError,
  InvalidEventAggregateIdError,
  InvalidEventAggregateTypeError,
  InvalidEventAggregateVersionError,
  NonNegativeVersionError,
  PastEventCannotBeAddedError,
} from './errors/aggregate';
import { GetProps } from './props-envelope';

export class AggregateBase<P extends object> extends EntityBase<P> {
  protected readonly _originalVersion: number;
  protected _pastEvents: AnyDomainEvent[] = [];
  protected _events: AnyDomainEvent[] = [];
  protected _initialSnapshot: typeof this;
  protected _snapshots: (typeof this)[] = [];
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
    const aggregateType = getAggregateType(this.prototype);

    id = id ?? generateUUIDWithPrefix(aggregateType);

    return new this(id, 0, false, props);
  }

  static loadAggregate<A extends AnyAggregate>(
    this: AggregateClass<A>,
    id: string,
    originalVersion: number,
    props: GetProps<A>,
  ) {
    return new this(id, originalVersion, true, props);
  }

  static loadAggregateFromSnapshot<A extends AnyAggregate>(
    this: AggregateClass<A>,
    id: string,
    snapshotVersion: number,
    snapshotProps: GetProps<A>,
    pastEvents: AnyDomainEvent[] = [],
  ) {
    const aggregate = this.loadAggregate(id, snapshotVersion, snapshotProps);

    aggregate.applyEvents(pastEvents, true);

    return aggregate;
  }

  init(props: P): void {
    super.init(props);

    this.makeInitialSnapshot();
  }

  getAggregateType() {
    const prototype = Object.getPrototypeOf(this);

    return getAggregateType(prototype);
  }

  isNew() {
    return this._originalVersion === 0 && !this._loaded;
  }

  @ToObject()
  get aggregateType() {
    return this.getAggregateType();
  }

  @ToObject()
  get originalVersion() {
    return this._originalVersion;
  }

  @ToObject()
  get loaded() {
    return this._loaded;
  }

  get pastEvents() {
    return this._pastEvents;
  }

  get events() {
    return this._events;
  }

  get initialSnapshot() {
    return this._initialSnapshot;
  }

  get snapshots() {
    return this._snapshots;
  }

  hasEvents() {
    return Boolean(this.events.length);
  }

  clearEvents() {
    this._events = [];
  }

  protected addEvent<E extends AnyDomainEvent>(event: E) {
    if (!this._events) this._events = [];

    this._events.push(event);
  }

  protected addPastEvent<E extends AnyDomainEvent>(event: E) {
    if (this.hasEvents()) throw new PastEventCannotBeAddedError();

    if (!this._pastEvents) this._pastEvents = [];

    this._pastEvents.push(event);
  }

  protected newEvent<E extends AnyDomainEvent>(
    eventClass: DomainEventClass<E>,
    props: GetProps<E>,
  ) {
    return eventClass.newEvent(
      {
        type: this.getAggregateType(),
        id: this.id,
        version: this.getNextEventVersion(),
      },
      props,
    );
  }

  @ToObject({ name: 'eventVersion' })
  getLastEventVersion() {
    const lastEvent = this.hasEvents() ? this._events.at(-1) : this._pastEvents.at(-1);

    if (lastEvent) return lastEvent.aggregate.version;

    return this.originalVersion;
  }

  getNextEventVersion() {
    return this.getLastEventVersion() + 1;
  }

  private validateEventBeforeApply<E extends AnyDomainEvent>(event: E) {
    if (event.aggregate.type !== this.getAggregateType())
      throw new InvalidEventAggregateTypeError();

    if (event.aggregate.id !== this.id) throw new InvalidEventAggregateIdError();

    if (event.aggregate.version !== this.getNextEventVersion())
      throw new InvalidEventAggregateVersionError();
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

    this.validateEventBeforeApply(event);

    if (!fromHistory) this.addEvent(event);
    else this.addPastEvent(event);

    applier(event);
  }

  applyEvents(events: AnyDomainEvent[], fromHistory = false) {
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

  snap() {
    const snapshot = _.cloneDeep(this);

    deepFreeze(snapshot);

    return snapshot;
  }

  private makeInitialSnapshot() {
    const initialSnapshot = this.snap();

    if (!this._initialSnapshot) this._initialSnapshot = initialSnapshot;
  }

  addSnapshot(snapshot: typeof this) {
    if (!this._snapshots) this._snapshots = [];

    this._snapshots.push(snapshot);
  }

  makeSnapshot() {
    const snapshot = this.snap();

    this.addSnapshot(snapshot);

    return snapshot;
  }
}

export type AggregateEventApplier<E extends AnyDomainEvent> = (event: E) => void;

export type AggregateCommandHandler<
  C extends AnyCommand,
  E extends AnyDomainEvent = AnyDomainEvent,
> = (command: C) => E | E[];

export type AnyAggregate = AggregateBase<any>;
