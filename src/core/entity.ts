import { getEntityType } from '#metadata/entity';
import { EntityClass } from '#types/entity.type';
import { generateUUIDWithPrefix } from 'src/utils';
import { GetProps, PropsEnvelopeWithId } from './props-envelope';
import { ToObject } from '#decorators/to-object';

export class EntityBase<P extends object> extends PropsEnvelopeWithId<P> {
  constructor(id: string, props?: P) {
    super(id, props);
  }

  static isEntity(obj: object): obj is AnyEntity {
    return obj instanceof EntityBase;
  }

  static initEntity<T extends AnyEntity>(this: EntityClass<T>, props?: GetProps<T>, id?: string) {
    const entityType = getEntityType(this.prototype);

    id = id ?? generateUUIDWithPrefix(entityType);

    return new this(id, props);
  }

  getEntityType() {
    const prototype = Object.getPrototypeOf(this);

    return getEntityType(prototype);
  }

  equalsType(entity: EntityBase<P>) {
    return entity instanceof this.constructor;
  }

  equals(entity: EntityBase<P>) {
    if (!this.equalsType(entity)) return false;

    return this.hasId(entity.id);
  }

  @ToObject()
  get entityType() {
    return this.getEntityType();
  }
}

export type AnyEntity = EntityBase<any>;
