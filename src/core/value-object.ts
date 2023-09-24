import { ValueObjectMetadata } from '#metadata/value-object.metadata';
import { ValueObjectClassWithProps } from '#types/value-object.type';
import _ from 'lodash';
import { Class } from 'type-fest';

export abstract class ValueObject<P> {
  protected readonly _props: P;

  constructor(props: P) {
    this.validateProps(props);

    this._props = ValueObject.cloneProps(props);
  }

  static cloneProps<P>(props: P) {
    return _.cloneDeep(props);
  }

  static isValueObject(obj: any) {
    return obj instanceof ValueObject;
  }

  abstract validateProps(props: P): void;

  getValueObjectMetadata() {
    return ValueObjectMetadata.getValueObjectMetadata(this.constructor as Class<ValueObject<P>>);
  }

  equalsType(obj: ValueObject<P>) {
    return obj instanceof this.constructor;
  }

  equals(obj: ValueObject<P>) {
    if (obj === null || obj === undefined) return false;

    if (!this.equalsType(obj)) return false;

    return JSON.stringify(this.getProps()) === JSON.stringify(obj.getProps());
  }

  cloneWith(props: Partial<P> = {}) {
    const clonedProps = this.getProps();

    const newProps = _.merge(clonedProps, props);

    return new (this.constructor as ValueObjectClassWithProps<P>)(newProps) as this;
  }

  clone() {
    return this.cloneWith();
  }

  getProps() {
    return ValueObject.cloneProps(this._props);
  }
}

export type AnyValueObject = ValueObject<any>;

export type GetValueObjectProps<T extends AnyValueObject> = T extends ValueObject<infer Props>
  ? Props
  : any;

export type ValueObjectConstructorParams<T extends AnyValueObject> = ConstructorParameters<
  typeof ValueObject<GetValueObjectProps<T>>
>;
