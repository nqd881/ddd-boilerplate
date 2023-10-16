import { ValueObjectClassWithProps } from '#types/value-object.type';
import _ from 'lodash';
import { PropsEnvelope } from './props-envelope';
import { getValueObjectType } from '#metadata/value-object';
import { ToObject } from '#decorators/to-object';

export class ValueObjectBase<P extends object> extends PropsEnvelope<P> {
  constructor(props: P) {
    super(props, true);
  }

  static isValueObject(obj: any) {
    return obj instanceof ValueObjectBase;
  }

  getValueObjectType() {
    const prototype = Object.getPrototypeOf(this);

    return getValueObjectType(prototype);
  }

  @ToObject()
  get valueObjectType() {
    return this.getValueObjectType();
  }

  equalsType(obj: ValueObjectBase<P>) {
    return obj instanceof this.constructor;
  }

  equals(obj: ValueObjectBase<P>) {
    if (obj === null || obj === undefined) return false;

    if (!this.equalsType(obj)) return false;

    return JSON.stringify(this.toObject()) === JSON.stringify(obj.toObject());
  }

  cloneWith(props: Partial<P> = {}) {
    const clonedProps = this.getProps();

    const newProps = _.merge(clonedProps, props);

    return new (this.constructor as ValueObjectClassWithProps<P>)(newProps) as this;
  }

  clone() {
    return this.cloneWith();
  }
}

export type AnyValueObject = ValueObjectBase<any>;
