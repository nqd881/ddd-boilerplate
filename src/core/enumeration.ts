import { getEnumerationMetadata } from '#metadata/enumeration.metadata';
import { EnumerationClass } from '#types/enumeration.type';
import { Class } from 'type-fest';

export type EnumerationValue = string | number;

export class Enumeration {
  private readonly _value: EnumerationValue;

  constructor(value: EnumerationValue) {
    this._value = value;
  }

  static getEnumerationMetadata<T extends AnyEnumeration>(this: Class<T>) {
    return getEnumerationMetadata(this);
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

export type AnyEnumeration = Enumeration;
