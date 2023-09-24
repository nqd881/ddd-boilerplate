import { Entity } from '#core/entity';
import { EntityType } from '#decorators/entity-type';

export class BookProps {
  title: string;
  description: string;
  pagesCount: number;
}

@EntityType(BookProps)
export class Book extends Entity<BookProps> {
  validateProps(props: BookProps): void {}

  get title() {
    return this._props.title;
  }

  get description() {
    return this._props.description;
  }

  get pagesCount() {
    return this._props.pagesCount;
  }

  changeTitle(newTitle: string) {
    this._props.title = newTitle;
  }

  changeDescription(newDescription: string) {
    this._props.description = newDescription;
  }

  changePagesCount(newPagesCount: number) {
    this._props.pagesCount = newPagesCount;
  }
}
