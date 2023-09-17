import { Account } from './account';
import { AccountStatus } from './account-status';
import { Password } from './password';

const account = Account.create({
  username: 'quocdaitinls',
  password: Password.initValueObject({
    value: '123123',
    hashed: false,
  }),
});

console.log(account);

console.log(AccountStatus.ActivatePending());

console.log(AccountStatus.allEnums());

console.log(AccountStatus.parseEnum('ActivatePending'));

console.log(AccountStatus.ActivatePending() === AccountStatus.ActivatePending());
console.log(AccountStatus.ActivatePending() === AccountStatus.Activated());
