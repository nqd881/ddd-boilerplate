import { ToObject } from '#decorators/to-object';
import { getEntityType } from '#metadata/entity';
import { EntityClass } from '#types/entity.type';
import { generateUUIDWithPrefix } from '#utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

export interface IEntityMetadata {
  id: string;
}
@ToObject()
export class EntityMetadata implements IEntityMetadata {
  private _id: string;

  constructor(metadata?: IEntityMetadata) {
    if (metadata) {
      this._id = metadata.id;
    }
  }

  get id() {
    return this._id;
  }
}

export class EntityBase<P extends object> extends PropsEnvelope<EntityMetadata, P> {
  constructor(metadata: IEntityMetadata, props?: P) {
    super(new EntityMetadata(metadata), props);
  }

  static isEntity(obj: object): obj is AnyEntity {
    return obj instanceof EntityBase;
  }

  static initEntity<T extends AnyEntity>(this: EntityClass<T>, props?: GetProps<T>, id?: string) {
    const entityType = getEntityType(this.prototype);

    id = id ?? generateUUIDWithPrefix(entityType);

    return new this({ id }, props);
  }

  @ToObject({ name: 'entityType', isMetadata: true })
  getEntityType() {
    const prototype = Object.getPrototypeOf(this);

    return getEntityType(prototype);
  }

  equalsType(entity: EntityBase<P>) {
    return entity instanceof this.constructor;
  }

  equals(entity: EntityBase<P>) {
    if (!this.equalsType(entity)) return false;

    return this.id === entity.id;
  }

  get id() {
    return this.metadata.id;
  }
}

export type AnyEntity = EntityBase<any>;
