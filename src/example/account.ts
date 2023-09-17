import { Aggregate } from '#core/aggregate';
import { AggregateType } from 'src/decorators';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Password } from './password';

export type AccountProps = {
  username: string;
  password: Password;
  status: AccountStatus;
};

export type CreateAccountProps = Omit<AccountProps, 'status'>;

@AggregateType()
export class Account extends Aggregate<AccountProps> {
  validateProps(props: AccountProps): void {}

  static create(props: CreateAccountProps) {
    const newAccount = this.initAggregate({
      ...props,
      status: AccountStatus.ActivatePending(),
    });

    const event = AccountCreatedEvent.newEvent(newAccount.id, {
      accountId: newAccount.id,
      username: newAccount.username,
    });

    console.log(event);

    newAccount.recordEvent(event);

    return newAccount;
  }

  get username() {
    return this._props.username;
  }

  get password() {
    return this._props.password;
  }

  get status() {
    return this._props.status;
  }
}
