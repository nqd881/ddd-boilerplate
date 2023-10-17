import { ToObject, ToObjectGroup } from '#decorators/to-object';
import { getPropsMetadata } from '#metadata/props';
import { ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import _ from 'lodash';
import {
  PropsClassNotFoundError,
  UninitializedError,
  UpdateImmutablePropsError,
  ValidatePropsFailedError,
} from './errors/props';
import { deepFreeze } from '#utils/deep-freeze';

export type PropsUpdateFn = () => void;

export class PropsEnvelope<P extends object> {
  private readonly _immutable: boolean;
  private _props?: P;

  constructor(props?: P, immutable: boolean = false) {
    this._immutable = immutable;

    if (props) this.init(props);
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

  init(props: P) {
    if (this.isInitialized()) return;

    props = this.makeProps(props);

    if (this.immutable) props = deepFreeze(props);

    this.setProps(props);
  }

  @ToObject()
  protected get props() {
    if (!this._props) throw new UninitializedError();

    return this._props;
  }

  get immutable() {
    return this._immutable;
  }

  getPropsMetadata() {
    const prototype = Object.getPrototypeOf(this);

    return getPropsMetadata<typeof this>(prototype);
  }

  transformProps(props: P) {
    const { propsClass, propsOptions } = this.getPropsMetadata();

    const cloneProps = PropsEnvelope.cloneProps(props);

    if (!propsClass) throw new PropsClassNotFoundError();

    if (props instanceof propsClass) return cloneProps;

    return plainToInstance(propsClass, cloneProps, propsOptions?.transformOptions);
  }

  validateProps(props?: P) {
    if (!props) return;

    const { propsClass, propsOptions } = this.getPropsMetadata();

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

  toObject(options?: ClassTransformOptions) {
    return instanceToPlain(this, {
      strategy: 'excludeAll',
      groups: [ToObjectGroup],
      ...options,
    });
  }
}

export class PropsEnvelopeWithId<P extends object> extends PropsEnvelope<P> {
  private readonly _id: string;

  constructor(id: string, props?: P, immutable?: boolean) {
    super(props, immutable);

    this._id = id;
  }

  @ToObject()
  get id() {
    return this._id;
  }

  hasId(id: string) {
    return this._id === id;
  }
}

export type AnyPropsEnvelope = PropsEnvelope<any>;

export type GetProps<T extends AnyPropsEnvelope> = T extends PropsEnvelope<infer P> ? P : never;
