import { PropsMetadata } from '#metadata/props.metadata';
import { PropsEnvelopeClassWithProps } from '#types/props-envelope.type';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';

export type Props = {
  [key: string]: any;
};

export type PropsUpdateFn = () => void;

export abstract class PropsEnvelope<P extends Props> {
  private readonly _immutable: boolean;
  private _updated: boolean;
  private readonly _initialProps: P;
  protected readonly _props: P;

  constructor(props: P, immutable: boolean = false) {
    this._updated = false;

    this._immutable = immutable;

    this._props = this.makePropsInstance(props);
    this._initialProps = this.makePropsInstance(props);
  }

  static cloneProps<P>(props: P) {
    return _.cloneDeep(props);
  }

  abstract validateProps(props: P): void;

  makePropsInstance(props: P) {
    this.validateProps(props);

    const { propsClass } = PropsMetadata.getPropsMetadata(
      this.constructor as PropsEnvelopeClassWithProps<P>,
    );

    if (!propsClass) return PropsEnvelope.cloneProps(props);

    if (!(props instanceof propsClass)) {
      return plainToInstance(propsClass, PropsEnvelope.cloneProps(props), {
        ignoreDecorators: true,
      });
    }

    return PropsEnvelope.cloneProps(props);
  }

  updateProps(updateFn: PropsUpdateFn) {
    if (this._immutable) throw new Error('Cannot update props of immutable props-envelope');

    updateFn();

    this._updated = true;

    this.validateProps(this._props);
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
