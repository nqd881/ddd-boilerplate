import { EntityBase } from '#core/entity';
import { Entity } from '#decorators/entity';
import { ToObject } from '#decorators/to-object';

@ToObject()
export class BookProps {
  title: string;
  description: string;
  pagesCount: number;
}

@Entity(BookProps)
export class Book extends EntityBase<BookProps> {
  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get pagesCount() {
    return this.props.pagesCount;
  }

  changeTitle(newTitle: string) {
    this.props.title = newTitle;
  }

  changeDescription(newDescription: string) {
    this.props.description = newDescription;
  }

  changePagesCount(newPagesCount: number) {
    this.props.pagesCount = newPagesCount;
  }
}
