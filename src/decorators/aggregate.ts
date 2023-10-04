import {
  AggregateBase,
  AggregateCommandHandler,
  AggregateEventApplier,
  AnyAggregate,
} from '#core/aggregate';
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
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { AggregateClass } from '#types/aggregate.type';
import { CommandClass } from '#types/command.type';
import { DomainEventClass } from '#types/domain-event.type';
import { Class } from 'type-fest';

export const Aggregate = <A extends AnyAggregate>(
  propsClass: Class<GetProps<A>>,
  aggregateType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends AggregateClass<A>>(target: U) => {
    definePropsMetadata(target, { propsClass, propsOptions });
    defineAggregateType(target, aggregateType ?? target.name);
  };
};

export const ApplyEvent = <E extends AnyDomainEvent>(domainEvent: DomainEventClass<E>) => {
  return <T extends AggregateEventApplier<E>>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    const eventType = getDomainEventType(domainEvent);

    defineAggregateEventApplier(target, eventType, descriptor.value!);
  };
};

export const ProcessCommand = <C extends AnyCommand>(commandClass: CommandClass<C>) => {
  return <T extends AggregateCommandHandler<C>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    const commandType = getCommandType(commandClass);

    defineAggregateCommandHandler(target, commandType, descriptor.value!);
  };
};
