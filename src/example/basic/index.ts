import { Account } from './account';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';

const bookA = Book.newEntity({
  title: 'Book A',
  description: 'Description of book A',
  pagesCount: 100,
});

const cardX = Card.newEntity({
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

account.updateCard(cardX);

account.changePassword(
  new Password({
    value: '456456',
    hashed: true,
  }),
);

console.log(account.toObject());
console.log(account.toObject().props.password);
