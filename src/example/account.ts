import { Aggregate } from '#core/aggregate';
import { AggregateType } from 'src/decorators';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';
import { Transform } from 'class-transformer';

export class AccountProps {
  username: string;
  password: Password;
  status: AccountStatus;
  books: Book[];

  @Transform(({ obj, key }) => {
    return obj[key];
  })
  cards: Map<Book, Card>;
}

export type CreateAccountProps = Omit<AccountProps, 'status'>;

@AggregateType(AccountProps)
export class Account extends Aggregate<AccountProps> {
  static create(props: CreateAccountProps) {
    const newAccount = this.initAggregate({
      ...props,
      status: AccountStatus.ActivatePending,
    });

    newAccount.recordEvent(AccountCreatedEvent, {
      accountId: newAccount.id,
      username: newAccount.username,
    });

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

  get books() {
    return this._props.books;
  }

  changePassword(newPassword: Password) {
    return this.updateProps(() => {
      this._props.password = newPassword;
    });
  }

  addBook(book: Book) {
    return this.updateProps(() => {
      this._props.books.push(book);
    });
  }

  removeBook(bookId: string) {
    return this.updateProps(() => {
      this._props.books = this._props.books.filter((book) => book.id !== bookId);
    });
  }

  updateCard(book: Book, card: Card) {
    return this.updateProps(() => {
      this._props.cards.set(book, card);
    });
  }
}
