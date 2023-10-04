import { AggregateBase } from '#core/aggregate';
import { Aggregate } from '#decorators/aggregate';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';
import { Transform, Type } from 'class-transformer';

export class AccountProps {
  username: string;
  password: Password;
  status: AccountStatus;
  books: Book[];

  // @Transform(({ obj, key }) => {
  //   return obj[key];
  // })
  // @Type(() => Map<Book, Card>)
  cards: Map<Book, Card>;
}

export type CreateAccountProps = Omit<AccountProps, 'status'>;

@Aggregate(AccountProps)
export class Account extends AggregateBase<AccountProps> {
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
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get status() {
    return this.props.status;
  }

  get books() {
    return this.props.books;
  }

  changePassword(newPassword: Password) {
    return this.updateProps(() => {
      this.props.password = newPassword;
    });
  }

  addBook(book: Book) {
    return this.updateProps(() => {
      this.props.books.push(book);
    });
  }

  removeBook(bookId: string) {
    return this.updateProps(() => {
      this.props.books = this.props.books.filter((book) => book.id !== bookId);
    });
  }

  updateCard(book: Book, card: Card) {
    return this.updateProps(() => {
      this.props.cards.set(book, card);
    });
  }
}
