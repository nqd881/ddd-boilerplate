import { Entity } from '#core/entity';
import { EntityType } from '#decorators/entity-type';
import { Card } from './card';

export class CardMapProps extends Map<string, Card> {}

@EntityType(CardMapProps)
export class CardMap extends Entity<CardMapProps> {
  validateProps(props: CardMapProps): void {}

  setCard(card: Card) {
    this._props.set(card.id, card);
  }

  getCard(cardId: string) {
    return this._props.get(cardId);
  }
}
