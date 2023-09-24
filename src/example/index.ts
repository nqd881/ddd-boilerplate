import { Account } from './account';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';

const bookA = Book.initEntity({
  title: 'Book A',
  description: 'Description of book A',
  pagesCount: 100,
});

const bookB = Book.initEntity({
  title: 'Book B',
  description: 'Description of book B',
  pagesCount: 150,
});

const cardX = Card.initEntity({
  name: 'Card X',
  group: 'X',
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

account.changePassword(
  new Password({
    value: '456456',
    hashed: true,
  }),
);

account.addBook(bookB);

account.updateCard(bookA, cardX);
// account.updateCard(bookB, cardX);

console.log(account.events);
