import { EntityBase } from '#core/entity';
import { Entity } from '#decorators/entity';

export class CardProps {
  name: string;
  group: string;
}

@Entity(CardProps)
export class Card extends EntityBase<CardProps> {
  get name() {
    return this.props.name;
  }

  get group() {
    return this.props.group;
  }
}
