import { Aggregate } from '#core/aggregate';
import { AggregateType } from 'src/decorators';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Password } from './password';
import { Book } from './book';
import { Card } from './card';
import { Transform, Type } from 'class-transformer';

export class AccountProps {
  username: string;
  password: Password;
  status: AccountStatus;

  books: Book[];

  @Transform(
    ({ value }) => {
      const transformedObj: Record<string, Card> = {};

      for (const [book, card] of value.entries()) {
        transformedObj[book.id] = card;
      }

      return transformedObj;
    },
    {
      toPlainOnly: true,
    },
  )
  cards: Map<Book, Card>;
}

export type CreateAccountProps = Omit<AccountProps, 'status'>;

@AggregateType(AccountProps)
export class Account extends Aggregate<AccountProps> {
  validateProps(props: AccountProps): void {
    if (props.password.value.startsWith('#'))
      throw new Error("Password can't start with # character");
  }

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

  changePassword(newPassword: Password) {
    this._props.password = newPassword;
  }

  addBook(book: Book) {
    this._props.books.push(book);
  }

  removeBook(bookId: string) {
    this._props.books = this._props.books.filter((book) => book.id !== bookId);
  }

  updateCard(book: Book, card: Card) {
    this._props.cards.set(book, card);
  }
}
