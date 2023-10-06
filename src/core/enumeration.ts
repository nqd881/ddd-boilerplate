import { ToObject } from '#decorators/to-object';
import { getEnumerationType } from '#metadata/enumeration';
import { EnumerationClass } from '#types/enumeration.type';

export type EnumerationValue = string | number;

export class EnumerationBase {
  private readonly _value: EnumerationValue;

  constructor(value: EnumerationValue) {
    this._value = value;
  }

  static parseEnum<T extends AnyEnumeration>(this: EnumerationClass<T>, value: EnumerationValue) {
    return this.allEnums().find((instance: T) => instance.value === value);
  }

  static allEnums<T extends AnyEnumeration>(this: EnumerationClass<T>): T[] {
    const properties = Object.getOwnPropertyNames(this);

    return properties.map((name) => (this as any)[name]).filter((value) => value instanceof this);
  }

  getEnumerationType() {
    return getEnumerationType(Object.getPrototypeOf(this));
  }

  @ToObject({ name: '_enumerationType' })
  get enumerationType() {
    return this.getEnumerationType();
  }

  @ToObject()
  get value() {
    return this._value;
  }

  equalsType(otherEnum: EnumerationBase) {
    return otherEnum instanceof this.constructor;
  }

  equals(otherEnum: EnumerationBase) {
    return this.equalsType(otherEnum) && this.value === otherEnum.value;
  }
}

export type AnyEnumeration = EnumerationBase;
