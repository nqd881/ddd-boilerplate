import { EntityClass } from '#types/entity.type';
import _ from 'lodash';
import { ENTITY_TYPE } from 'src/decorators';
import { v4 } from 'uuid';
import 'reflect-metadata';

export type EntityUpdateFn = () => void;

export type EntityUpdateResult<T extends AnyEntity = AnyEntity> = {
  beforeProps?: GetEntityProps<T>;
  afterProps?: GetEntityProps<T>;
};

export class EntityUpdater<T extends AnyEntity = AnyEntity> {
  entity: T;
  updateFn: EntityUpdateFn;
  result: EntityUpdateResult<T>;
  executed: boolean;

  constructor(entity: T, updateFn: EntityUpdateFn) {
    this.entity = entity;
    this.updateFn = updateFn;
    this.result = {};
    this.executed = false;
  }

  update() {
    if (this.executed) return;

    this.result.beforeProps = this.entity.getProps();

    this.updateFn();

    this.result.afterProps = this.entity.getProps();

    this.executed = true;

    return this.result;
  }
}

export abstract class Entity<P> {
  private readonly _type: string;
  private readonly _id: string;
  private _marked: boolean;
  private _updaters: EntityUpdater[];

  protected _props: P;

  constructor(type: string, id: string, props: P) {
    this._type = type;
    this._id = id;
    this._marked = false;
    this._updaters = [];

    this.setProps(props);
  }

  static isEntity(obj: any): obj is AnyEntity {
    return obj instanceof Entity;
  }

  static getEntityType<T extends AnyEntity>(this: EntityClass<T>) {
    return Reflect.getMetadata(ENTITY_TYPE, this) ?? this.name;
  }

  static initEntity<T extends AnyEntity>(
    this: EntityClass<T>,
    props: GetEntityProps<T>,
    id: string = v4(),
  ) {
    const entityType = this.getEntityType();

    return new this(entityType, id, props);
  }

  abstract validateProps(props: P): void;

  get type() {
    return this._type;
  }

  get id() {
    return this._id;
  }

  get updaters() {
    return this._updaters;
  }

  private setProps(props: P) {
    this.validateProps(props);

    this._props = props;
  }

  hasId(id: string) {
    return this.id === id;
  }

  protected mark() {
    this._marked = true;
  }

  protected unmark() {
    this._marked = false;
  }

  protected update(updateFn: EntityUpdateFn) {
    const updater: EntityUpdater<typeof this> = new EntityUpdater(this, updateFn);

    const result = updater.update();

    this.validateProps(this._props);

    this._updaters.push(updater);

    this.mark();

    return result;
  }

  hasChanged() {
    return this._marked;
  }

  equalsType(entity: AnyEntity) {
    return entity instanceof this.constructor;
  }

  equals(entity: AnyEntity) {
    if (!this.equalsType(entity)) return false;

    return this.hasId(entity.id);
  }

  getProps() {
    return _.cloneDeep(this._props);
  }
}

export type AnyEntity = Entity<any>;

export type GetEntityProps<T extends AnyEntity> = T extends Entity<infer Props> ? Props : never;

export type EntityConstructorParamsWithProps<Props> = ConstructorParameters<typeof Entity<Props>>;

export type EntityConstructorParams<T extends AnyEntity> = EntityConstructorParamsWithProps<
  GetEntityProps<T>
>;
