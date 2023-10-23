import {
  AggregateCommandHandler,
  AggregateEventApplier,
  AggregateMetadata,
  AnyAggregate,
} from '#core/aggregate';
import { AnyCommand } from '#core/command';
import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import {
  AggregateRegistry,
  defineAggregateCommandHandler,
  defineAggregateEventApplier,
  defineAggregateType,
} from '#metadata/aggregate';
import { getCommandType } from '#metadata/command';
import { getDomainEventType } from '#metadata/domain-event';
import { defineMetadataClass } from '#metadata/metadata';
import { definePropsClass } from '#metadata/props';
import { AggregateClass } from '#types/aggregate.type';
import { CommandClass } from '#types/command.type';
import { DomainEventClass } from '#types/domain-event.type';
import { isFunction } from 'lodash';
import { Class } from 'type-fest';

// define on prototype of class
export const Aggregate = <A extends AnyAggregate>(
  propsClass: Class<GetProps<A>>,
  aggregateType?: string,
) => {
  return <U extends AggregateClass<A>>(target: U) => {
    aggregateType = aggregateType ?? target.name;

    defineMetadataClass(target.prototype, AggregateMetadata);
    definePropsClass(target.prototype, propsClass);
    defineAggregateType(target.prototype, aggregateType);

    AggregateRegistry.register(aggregateType, target);
  };
};

export const ApplyEvent = <E extends AnyDomainEvent>(domainEventClass: DomainEventClass<E>) => {
  return <T extends AggregateEventApplier<E>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    if (isFunction(descriptor.value)) {
      const eventType = getDomainEventType(domainEventClass.prototype);

      defineAggregateEventApplier(target, eventType, descriptor.value);
    }
  };
};

export const ProcessCommand = <C extends AnyCommand>(commandClass: CommandClass<C>) => {
  return <T extends AggregateCommandHandler<C>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    if (isFunction(descriptor.value)) {
      const commandType = getCommandType(commandClass.prototype);

      defineAggregateCommandHandler(target, commandType, descriptor.value);
    }
  };
};
