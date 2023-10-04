import {
  getAggregateCommandHandler,
  getAggregateEventApplier,
  getAggregateType,
} from '#metadata/aggregate';
import { getCommandType } from '#metadata/command';
import { getDomainEventType } from '#metadata/domain-event';
import { AggregateClass } from '#types/aggregate.type';
import { DomainEventClass } from '#types/domain-event.type';
import { generateUUIDWithPrefix } from 'src/utils/id';
import { AnyCommand } from './command';
import { AnyDomainEvent } from './domain-event';
import { EntityBase } from './entity';
import { GetProps } from './props-envelope';

export class AggregateBase<P extends object> extends EntityBase<P> {
  protected _originalVersion: number;
  protected _events: AnyDomainEvent[];

  // loaded from repo or new instance
  protected _loaded: boolean;

  constructor(id: string, originalVersion: number, loaded: boolean, props?: P) {
    super(id, props);

    if (originalVersion < 0) throw new Error('Version must be set with non-negative number');

    this._originalVersion = originalVersion;
    this._events = [];
    this._loaded = loaded;
  }

  static isAggregate(obj: object): obj is AggregateBase<any> {
    return obj instanceof AggregateBase;
  }

  static initAggregate<A extends AnyAggregate>(
    this: AggregateClass<A>,
    props?: GetProps<A>,
    id = generateUUIDWithPrefix(getAggregateType(this)),
  ) {
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

  hasEvents() {
    return Boolean(this.events.length);
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

  applyEvent<E extends AnyDomainEvent>(event: E, fromHistory = false) {
    const eventType = getDomainEventType(event.constructor as any);

    const prototype = Object.getPrototypeOf(this);

    const applier = getAggregateEventApplier(prototype, eventType);

    if (!applier) throw new Error(`Cannot apply event type ${eventType}`);

    applier.bind(this)(event);

    if (!fromHistory) this.recordEvent(event);
  }

  applyEvents(events: AnyDomainEvent[], fromHistory = true) {
    events.forEach((event) => {
      this.applyEvent(event, fromHistory);
    });
  }

  processCommand<C extends AnyCommand>(command: C) {
    const commandType = getCommandType(command.constructor as any);

    const prototype = Object.getPrototypeOf(this);

    const handler = getAggregateCommandHandler(prototype, commandType);

    if (!handler) throw new Error(`Cannot process command type ${commandType}`);

    const event = handler.bind(this)(command);

    if (command.correlationId) event.setCorrelationId(command.correlationId);

    return event;
  }

  processCommands(commands: AnyCommand[]) {
    const events: AnyDomainEvent[] = [];

    commands.forEach((command) => {
      events.push(this.processCommand(command));
    });

    return events;
  }
}

export type AggregateEventApplier<E extends AnyDomainEvent> = (event: E) => void;

export type AggregateCommandHandler<
  C extends AnyCommand,
  E extends AnyDomainEvent = AnyDomainEvent,
> = (command: C) => E;

export type AnyAggregate = AggregateBase<any>;
