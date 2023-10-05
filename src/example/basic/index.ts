import { Account } from './account';
import { AccountStatus } from './account-status';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';

const bookA = Book.initEntity({
  title: 'Book A',
  description: 'Description of book A',
  pagesCount: 100,
});

const cardX = Card.initEntity({
  name: 'Card X',
  group: 'A',
});

const account = Account.create({
  username: 'quocdaitinls',
  password: new Password({
    value: '123123',
    hashed: false,
  }),
  books: [bookA],
  cards: new Map(),
});

account.updateCard(bookA, cardX);

account.changePassword(
  new Password({
    value: '456456',
    hashed: true,
  }),
);

console.log(account);
console.log(account.getProps());
console.log(account.status.equals(AccountStatus.ActivatePending));

console.log(Object.getOwnPropertyNames(AccountStatus));
