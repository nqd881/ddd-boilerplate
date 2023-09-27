import { ValueObjectClassWithProps } from '#types/value-object.type';
import _ from 'lodash';
import { Props, PropsEnvelope } from './props-envelope';

export class ValueObject<P extends Props> extends PropsEnvelope<P> {
  constructor(props: P) {
    super(props, true);
  }

  static isValueObject(obj: any) {
    return obj instanceof ValueObject;
  }

  equalsType(obj: ValueObject<P>) {
    return obj instanceof this.constructor;
  }

  equals(obj: ValueObject<P>) {
    if (obj === null || obj === undefined) return false;

    if (!this.equalsType(obj)) return false;

    return JSON.stringify(this.cloneProps()) === JSON.stringify(obj.cloneProps());
  }

  cloneWith(props: Partial<P> = {}) {
    const clonedProps = this.cloneProps();

    const newProps = _.merge(clonedProps, props);

    return new (this.constructor as ValueObjectClassWithProps<P>)(newProps) as this;
  }

  clone() {
    return this.cloneWith();
  }
}

export type AnyValueObject = ValueObject<any>;
