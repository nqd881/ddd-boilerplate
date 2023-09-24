import { EntityMetadata } from '#metadata/entity.metadata';
import { EntityClass } from '#types/entity.type';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import 'reflect-metadata';
import { Class } from 'type-fest';
import { v4 } from 'uuid';

export interface EntityProps {
  [key: string]: any;
}

export abstract class Entity<P extends EntityProps> {
  private readonly _id: string;
  protected readonly _initialProps: P;
  protected readonly _props: P;

  constructor(id: string, props: P) {
    this._id = id;

    this.validateProps(props);

    this._initialProps = this.makePropsInstance(props);
    this._props = this.makePropsInstance(props);
  }

  static isEntity(obj: object): obj is AnyEntity {
    return obj instanceof Entity;
  }

  getEntityMetadata() {
    return EntityMetadata.getEntityMetadata(this.constructor as Class<Entity<P>>);
  }

  static initEntity<T extends AnyEntity>(
    this: EntityClass<T>,
    props: GetEntityProps<T>,
    id: string = v4(),
  ) {
    return new this(id, props);
  }

  static cloneProps<P extends EntityProps>(props: P) {
    return _.cloneDeep(props);
  }

  abstract validateProps(props: P): void;

  get id() {
    return this._id;
  }

  private makePropsInstance(props: P) {
    if (!props) return props;

    const { propsClass } = this.getEntityMetadata();

    if (!(props instanceof propsClass))
      return plainToInstance(propsClass, Entity.cloneProps(props));

    return props;
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

  getInitialProps() {
    return Entity.cloneProps(this._initialProps);
  }

  getProps() {
    return Entity.cloneProps(this._props);
  }
}

export type AnyEntity = Entity<any>;

export type GetEntityProps<T extends AnyEntity> = T extends Entity<infer Props> ? Props : never;

export type EntityConstructorParamsWithProps<Props extends EntityProps> = ConstructorParameters<
  typeof Entity<Props>
>;

export type EntityConstructorParams<T extends AnyEntity> = EntityConstructorParamsWithProps<
  GetEntityProps<T>
>;
