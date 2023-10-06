import { EntityBase } from '#core/entity';
import { Entity } from '#decorators/entity';
import { ToObject } from '#decorators/to-object';

export class CardProps {
  name: string;
  group: string;
}

@Entity(CardProps)
export class Card extends EntityBase<CardProps> {
  @ToObject()
  get name() {
    return this.props.name;
  }

  @ToObject()
  get group() {
    return this.props.group;
  }
}
