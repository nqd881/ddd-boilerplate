import { AggregateCommandHandler, AggregateEventApplier, AnyAggregate } from '#core/aggregate';
import { AnyCommand } from '#core/command';
import { AnyDomainEvent } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import {
  defineAggregateCommandHandler,
  defineAggregateEventApplier,
  defineAggregateType,
} from '#metadata/aggregate';
import { getCommandType } from '#metadata/command';
import { getDomainEventType } from '#metadata/domain-event';
import { defineEntityType } from '#metadata/entity';
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { AggregateClass } from '#types/aggregate.type';
import { CommandClass } from '#types/command.type';
import { DomainEventClass } from '#types/domain-event.type';
import { isFunction } from 'lodash';
import { Class } from 'type-fest';

// define on prototype of class
export const Aggregate = <A extends AnyAggregate>(
  propsClass: Class<GetProps<A>>,
  aggregateType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends AggregateClass<A>>(target: U) => {
    aggregateType = aggregateType ?? target.name;

    definePropsMetadata(target.prototype, { propsClass, propsOptions });
    defineAggregateType(target.prototype, aggregateType);
    defineEntityType(target.prototype, aggregateType);
  };
};

export const ApplyEvent = <E extends AnyDomainEvent>(domainEvent: DomainEventClass<E>) => {
  return <T extends AggregateEventApplier<E>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    if (isFunction(descriptor.value)) {
      const eventType = getDomainEventType(domainEvent.prototype);

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
