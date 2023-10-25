import { AggregateBase } from '#core/aggregate';
import { Aggregate } from '#decorators/aggregate';
import { Props } from '#decorators/props';
import { AccountCreatedEvent } from './account-created.event';
import { AccountStatus } from './account-status';
import { Book } from './book';
import { Card } from './card';
import { Password } from './password';

@Props()
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
    const newAccount = this.newAggregate({
      ...props,
      status: AccountStatus.ActivatePending,
    });

    const accountCreatedEvent = newAccount.newEvent(AccountCreatedEvent, {
      accountId: newAccount.id,
      username: newAccount.username,
    });

    newAccount.addEvent(accountCreatedEvent);

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
