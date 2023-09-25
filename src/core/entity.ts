import { EntityClass } from '#types/entity.type';
import { v4 } from 'uuid';
import { GetProps, Props, PropsEnvelope } from './props-envelope';

export abstract class Entity<P extends Props> extends PropsEnvelope<P> {
  private readonly _id: string;

  constructor(id: string, props: P) {
    super(props);

    this._id = id;
  }

  static isEntity(obj: object): obj is AnyEntity {
    return obj instanceof Entity;
  }

  static initEntity<T extends AnyEntity>(
    this: EntityClass<T>,
    props: GetProps<T>,
    id: string = v4(),
  ) {
    return new this(id, props);
  }

  get id() {
    return this._id;
  }

  hasId(id: string) {
    return this.id === id;
  }

  equalsType(entity: AnyEntity) {
    return entity instanceof this.constructor;
  }

  equals(entity: AnyEntity) {
    if (!this.equalsType(entity)) return false;

    return this.hasId(entity.id);
  }
}

export type AnyEntity = Entity<any>;

export type EntityConstructorParamsWithProps<P extends Props> = ConstructorParameters<
  typeof Entity<P>
>;

export type EntityConstructorParams<T extends AnyEntity> = EntityConstructorParamsWithProps<
  GetProps<T>
>;
