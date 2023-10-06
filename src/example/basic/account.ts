import { AggregateBase } from '#core/aggregate';
import { Aggregate } from '#decorators/aggregate';
import { ToObject } from '#decorators/to-object';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';

export class AccountProps {
  username: string;
  password: Password;
  status: AccountStatus;
  books: Book[];
  cards: Map<string, Card>;
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

  @ToObject()
  get username() {
    return this.props.username;
  }

  @ToObject()
  get password() {
    return this.props.password;
  }

  @ToObject()
  get status() {
    return this.props.status;
  }

  @ToObject()
  get books() {
    return this.props.books;
  }

  @ToObject()
  get cards() {
    return this.props.cards;
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

  updateCard(card: Card) {
    return this.updateProps(() => {
      this.props.cards.set(card.id, card);
    });
  }
}
