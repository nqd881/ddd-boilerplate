import { getPropsMetadata } from '#metadata/props.metadata';
import { PropsEnvelopeClassWithProps } from '#types/props-envelope.type';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import _ from 'lodash';

export type Props = {
  [key: string]: any;
};

export type PropsUpdateFn = () => void;

export class PropsEnvelope<P extends Props> {
  private readonly _immutable: boolean;
  private _updated: boolean;
  private readonly _initialProps: P;
  protected readonly _props: P;

  constructor(props: P, immutable: boolean = false) {
    this._updated = false;

    this._immutable = immutable;

    this._props = this.transformProps(props);
    this._initialProps = this.transformProps(props);

    this.validate();
  }

  static cloneProps<P>(props: P) {
    return _.cloneDeep(props);
  }

  getPropsMetadata() {
    return getPropsMetadata(this.constructor as PropsEnvelopeClassWithProps<P>);
  }

  transformProps(props: P) {
    const {
      propsClass,
      options: { transformOptions },
    } = this.getPropsMetadata();

    const cloneProps = PropsEnvelope.cloneProps(props);

    if (!propsClass) return cloneProps;

    if (props instanceof propsClass) return cloneProps;

    return plainToInstance(propsClass, cloneProps, transformOptions);
  }

  private validateProps(props: P) {
    if (!props) return;

    const {
      options: { validatorOptions },
    } = this.getPropsMetadata();

    const errors = validateSync(props, validatorOptions);

    if (errors.length > 0) throw new Error('Validate props failed');
  }

  validate() {
    this.validateProps(this._props);
  }

  updateProps(updateFn: PropsUpdateFn) {
    if (this._immutable) throw new Error('Cannot update props of immutable props-envelope');

    updateFn();

    this.validate();

    this._updated = true;
  }

  cloneInitialProps() {
    return PropsEnvelope.cloneProps(this._initialProps);
  }

  cloneProps() {
    return PropsEnvelope.cloneProps(this._props);
  }

  hasChanged() {
    return this._updated;
  }

  get immutable() {
    return this._immutable;
  }
}

export type AnyPropsEnvelope = PropsEnvelope<any>;

export type GetProps<T extends AnyPropsEnvelope> = T extends PropsEnvelope<infer P> ? P : never;
