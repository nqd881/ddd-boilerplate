import { getEntityType } from '#metadata/entity';
import { EntityClass } from '#types/entity.type';
import { generateUUIDWithPrefix } from 'src/utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

export class EntityBase<P extends object> extends PropsEnvelope<P> {
  private readonly _id: string;

  constructor(id: string, props?: P) {
    super(props);

    this._id = id;
  }

  static isEntity(obj: object): obj is AnyEntity {
    return obj instanceof EntityBase;
  }

  static initEntity<T extends AnyEntity>(
    this: EntityClass<T>,
    props?: GetProps<T>,
    id = generateUUIDWithPrefix(getEntityType(this)),
  ) {
    return new this(id, props);
  }

  get id() {
    return this._id;
  }

  hasId(id: string) {
    return this.id === id;
  }

  equalsType(entity: EntityBase<P>) {
    return entity instanceof this.constructor;
  }

  equals(entity: EntityBase<P>) {
    if (!this.equalsType(entity)) return false;

    return this.hasId(entity.id);
  }
}

export type AnyEntity = EntityBase<any>;
