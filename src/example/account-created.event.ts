import { DomainEvent } from '#core/domain-event';
import { DomainEventType } from 'src/decorators/domain-event-type';

export class AccountCreatedEventProps {
  accountId: string;
  username: string;
}

@DomainEventType(AccountCreatedEventProps, 'account.created')
export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventProps> {}
