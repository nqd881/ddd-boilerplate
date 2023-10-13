import { DomainEventBase } from '#core/domain-event';
import { DomainEvent } from '#decorators/domain-event';
import { ToObject } from '#decorators/to-object';

@ToObject()
export class AccountCreatedEventProps {
  accountId: string;
  username: string;
}

@DomainEvent(AccountCreatedEventProps, 'account.created')
export class AccountCreatedEvent extends DomainEventBase<AccountCreatedEventProps> {}
