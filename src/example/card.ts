import { Entity } from '#core/entity';
import { EntityType } from '#decorators/entity-type';

export class CardProps {
  name: string;
  group: string;
}

@EntityType(CardProps)
export class Card extends Entity<CardProps> {
  validateProps(props: CardProps): void {}

  get name() {
    return this._props.name;
  }

  get group() {
    return this._props.group;
  }
}
