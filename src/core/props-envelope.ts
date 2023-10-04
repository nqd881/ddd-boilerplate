import { getPropsMetadata } from '#metadata/props';
import { ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import _ from 'lodash';
import { Class } from 'type-fest';
import { UninitializedError } from './errors/props';

export type PropsUpdateFn = () => void;

export class PropsEnvelope<P extends object> {
  private readonly _immutable: boolean;
  private _initialProps?: P;
  private _props?: P;

  constructor(props?: P, immutable: boolean = false) {
    this._immutable = immutable;

    if (props) this.init(props);
  }

  static cloneProps<P extends object>(props?: P) {
    return _.cloneDeep(props);
  }

  isInitialized() {
    return Boolean(this._initialProps && this._props);
  }

  private setInitialProps(props: P) {
    this._initialProps = props;
  }

  private setProps(props: P) {
    this._props = props;
  }

  init(props: P) {
    if (this.isInitialized()) return;

    const initialProps = () => this.makeProps(props);

    this.setInitialProps(initialProps());
    this.setProps(initialProps());
  }

  protected get initialProps() {
    if (!this.isInitialized()) throw UninitializedError;

    return this._initialProps!;
  }

  protected get props() {
    if (!this.isInitialized()) throw UninitializedError;

    return this._props!;
  }

  get immutable() {
    return this._immutable;
  }

  getPropsMetadata() {
    return getPropsMetadata(this.constructor as Class<AnyPropsEnvelope>);
  }

  transformProps(props: P) {
    const { propsClass, propsOptions } = this.getPropsMetadata();

    const cloneProps = PropsEnvelope.cloneProps(props);

    if (!propsClass) throw new Error('Not found props class in metadata');

    if (props instanceof propsClass) return cloneProps;

    return plainToInstance(propsClass, cloneProps, propsOptions?.toPropsOptions);
  }

  validateProps(props?: P) {
    if (!props) return;

    const { propsOptions } = this.getPropsMetadata();

    const errors = validateSync(props, propsOptions?.validatorOptions);

    if (errors.length > 0) throw new Error('Validate props failed');
  }

  makeProps(props: P) {
    const transformedProps = this.transformProps(props);

    this.validateProps(transformedProps);

    return transformedProps;
  }

  validate() {
    this.validateProps(this._initialProps);
    this.validateProps(this._props);
  }

  updateProps(updateFn: PropsUpdateFn) {
    if (this._immutable) throw new Error('Cannot update props of immutable props-envelope');

    updateFn();

    this.validate();
  }

  getInitialProps() {
    return PropsEnvelope.cloneProps(this._initialProps);
  }

  getProps() {
    return PropsEnvelope.cloneProps(this._props);
  }

  protected makePropsObject(props?: P, options?: ClassTransformOptions) {
    if (!props) return props;

    const { propsOptions } = this.getPropsMetadata();

    options = _.merge(propsOptions?.toObjectOptions, options);

    return instanceToPlain(props, options);
  }

  getInitialPropsObject(options?: ClassTransformOptions) {
    return this.makePropsObject(this._initialProps, options);
  }

  getPropsObject(options?: ClassTransformOptions) {
    return this.makePropsObject(this._props, options);
  }
}

export type AnyPropsEnvelope = PropsEnvelope<any>;

export type GetProps<T extends AnyPropsEnvelope> = T extends PropsEnvelope<infer P> ? P : never;
