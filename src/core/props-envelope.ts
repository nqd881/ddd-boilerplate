import { ToObject, ToObjectGroup } from '#decorators/to-object';
import { getPropsClass, getPropsOptions } from '#metadata/props';
import { deepFreeze } from '#utils/deep-freeze';
import { ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { dot, object } from 'dot-object';
import _ from 'lodash';
import {
  PropsClassNotFoundError,
  UninitializedError,
  UpdateImmutablePropsError,
  ValidatePropsFailedError,
} from './errors/props';

export type PropsUpdateFn = () => void;

export type PlainObject = {
  [key: string]: any;
};

export class PropsEnvelope<M extends object, P extends object> {
  private readonly _immutable: boolean;
  private _metadata: M;
  private _props?: P;

  constructor(metadata: M, props?: P, immutable: boolean = false) {
    this._immutable = immutable;

    this._metadata = metadata;

    if (props) this.initProps(props);
  }

  static cloneProps<P extends object>(props: P) {
    return _.cloneDeep(props);
  }

  isInitialized() {
    return Boolean(this._props);
  }

  private setProps(props: P) {
    this._props = props;
  }

  initProps(props: P) {
    if (this.isInitialized()) return;

    props = this.makeProps(props);

    if (this.immutable) props = deepFreeze(props);

    this.setProps(props);
  }

  @ToObject()
  get metadata() {
    return this._metadata;
  }

  @ToObject()
  protected get props() {
    if (!this._props) throw new UninitializedError();

    return this._props;
  }

  get immutable() {
    return this._immutable;
  }

  getPropsClass() {
    const prototype = Object.getPrototypeOf(this);

    return getPropsClass<typeof this>(prototype);
  }

  getPropsOptions() {
    const propsClass = this.getPropsClass();

    return getPropsOptions(propsClass.prototype);
  }

  transformProps(props: P) {
    const propsClass = this.getPropsClass();
    const propsOptions = this.getPropsOptions();

    const cloneProps = PropsEnvelope.cloneProps(props);

    if (!propsClass) throw new PropsClassNotFoundError();

    if (props instanceof propsClass) return cloneProps;

    return plainToInstance(propsClass, cloneProps, propsOptions?.transformOptions);
  }

  validateProps(props?: P) {
    if (!props) return;

    const propsClass = this.getPropsClass();
    const propsOptions = this.getPropsOptions();

    if (!(props instanceof propsClass)) props = this.transformProps(props);

    const errors = validateSync(props, propsOptions?.validatorOptions);

    if (errors.length > 0) throw new ValidatePropsFailedError();
  }

  makeProps(props: P) {
    const transformedProps = this.transformProps(props);

    this.validateProps(transformedProps);

    return transformedProps;
  }

  validate() {
    this.validateProps(this._props);
  }

  updateProps(updateFn: PropsUpdateFn) {
    if (this._immutable) throw new UpdateImmutablePropsError();

    updateFn();

    this.validate();
  }

  getProps() {
    if (!this._props) throw new UninitializedError();

    return PropsEnvelope.cloneProps(this._props);
  }

  toObject(options?: ClassTransformOptions): PlainObject {
    const obj = instanceToPlain(this, {
      strategy: 'excludeAll',
      groups: [ToObjectGroup],
      ...options,
    });

    return object(dot(obj));
  }
}

export type AnyPropsEnvelope = PropsEnvelope<any, any>;

export type GetMetadata<T extends AnyPropsEnvelope> = T extends PropsEnvelope<infer M, any>
  ? M
  : never;

export type GetProps<T extends AnyPropsEnvelope> = T extends PropsEnvelope<any, infer P>
  ? P
  : never;
