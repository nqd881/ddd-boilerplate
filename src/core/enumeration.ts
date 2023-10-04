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
    const properties = Object.keys(this);

    return properties.map((name) => (this as any)[name]).filter((value) => value instanceof this);
  }

  get value() {
    return this._value;
  }
}

export type AnyEnumeration = EnumerationBase;
