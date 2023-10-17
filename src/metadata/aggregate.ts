import { AggregateCommandHandler, AggregateEventApplier } from '#core/aggregate';
import { AnyCommand } from '#core/command';
import { AnyDomainEvent } from '#core/domain-event';
import { AnyAggregateClass } from '#types/aggregate.type';
import {
  AGGREGATE_COMMANDS_METADATA,
  AGGREGATE_EVENTS_METADATA,
  AGGREGATE_TYPE,
} from './constants';
import { AggregateTypeHasNotBeenSetError } from './errors';
import { Registry } from './registry';

export const AggregateRegistry = new Registry<AnyAggregateClass>();

// Aggregate Type
export const defineAggregateType = (target: object, aggregateType: string) => {
  Reflect.defineMetadata(AGGREGATE_TYPE, aggregateType, target);
};

export const getAggregateType = (target: object): string => {
  const aggregateType = Reflect.getMetadata(AGGREGATE_TYPE, target);

  if (!aggregateType) throw new AggregateTypeHasNotBeenSetError();

  return aggregateType;
};

// Aggregate Event Applier
export const getAggregateEventAppliersMap = <E extends AnyDomainEvent>(
  target: object,
): Map<string, AggregateEventApplier<E>> => {
  return (
    Reflect.getMetadata(AGGREGATE_EVENTS_METADATA, target) ||
    new Map<string, AggregateEventApplier<E>>()
  );
};

export const defineAggregateEventApplier = <T extends AnyDomainEvent>(
  target: object,
  eventType: string,
  applier: AggregateEventApplier<T>,
) => {
  const eventAppliersMap = getAggregateEventAppliersMap(target);

  eventAppliersMap.set(eventType, applier as AggregateEventApplier<AnyDomainEvent>);

  Reflect.defineMetadata(AGGREGATE_EVENTS_METADATA, eventAppliersMap, target);
};

export const getAggregateEventApplier = (target: object | null, eventType: string) => {
  if (!target) return null;

  do {
    const eventAppliersMap = getAggregateEventAppliersMap(target);

    const eventApplier = eventAppliersMap.get(eventType);

    if (eventApplier) return eventApplier;
  } while ((target = Reflect.getPrototypeOf(target)) && target !== Object.prototype);

  return null;
};

// Aggregate Command Handler
export const getAggregateCommandHandlersMap = <C extends AnyCommand>(
  target: object,
): Map<string, AggregateCommandHandler<C>> => {
  return (
    Reflect.getMetadata(AGGREGATE_COMMANDS_METADATA, target) ||
    new Map<string, AggregateCommandHandler<C>>()
  );
};

export const defineAggregateCommandHandler = <C extends AnyCommand>(
  target: object,
  commandType: string,
  handler: AggregateCommandHandler<C>,
) => {
  const commandHandlersMap = getAggregateCommandHandlersMap(target);

  commandHandlersMap.set(commandType, handler as AggregateCommandHandler<AnyCommand>);

  Reflect.defineMetadata(AGGREGATE_COMMANDS_METADATA, commandHandlersMap, target);
};

export const getAggregateCommandHandler = (target: object | null, commandType: string) => {
  if (!target) return null;

  do {
    const commandHandlersMap = getAggregateCommandHandlersMap(target);

    const commandHandler = commandHandlersMap.get(commandType);

    if (commandHandler) return commandHandler;
  } while ((target = Reflect.getPrototypeOf(target)) && target !== Object.prototype);

  return null;
};
