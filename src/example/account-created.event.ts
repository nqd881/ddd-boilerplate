import { DomainEvent } from '#core/domain-event';
import { DomainEventType } from 'src/decorators/domain-event-type';

export type AccountCreatedEventProps = {
  accountId: string;
  username: string;
};

@DomainEventType()
export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventProps> {}
