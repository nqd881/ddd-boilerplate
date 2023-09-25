import { AnyDomainEvent, DomainEvent, DomainEventConstructorParams } from '#core/domain-event';
import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';

export type DomainEventClass<T extends AnyDomainEvent> = Omit<
  typeof DomainEvent<GetProps<T>>,
  'constructor'
> &
  Class<T, DomainEventConstructorParams<T>>;

export type DomainEventClassWithProps<P extends object> = DomainEventClass<DomainEvent<P>>;
