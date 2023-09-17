import { EnumerationClass } from '#types/enumeration.type';
import { ENUMERATION_TYPE } from 'src/decorators';
import 'reflect-metadata';

export type EnumerationValue = string | number;

export type EnumerationGenerator<T extends Enumeration> = {
  (): T;
  _isEnumGenerator: boolean;
  _enum?: T;
};

export class Enumeration {
  private readonly _type: string;
  private readonly _value: EnumerationValue;

  constructor(type: string, value: EnumerationValue) {
    this._type = type;
    this._value = value;
  }

  static getEnumerationType<T extends AnyEnumeration>(this: EnumerationClass<T>) {
    return Reflect.getMetadata(ENUMERATION_TYPE, this) ?? this.name;
  }

  static newEnum<T extends AnyEnumeration>(
    this: EnumerationClass<T>,
    value: EnumerationValue,
  ): EnumerationGenerator<T> {
    const enumClass = this;

    let _enum: T | undefined;
    function generator(): T {
      if (!_enum) {
        const enumerationType = enumClass.getEnumerationType();

        _enum = new enumClass(enumerationType, value);
      }

      return _enum!;
    }

    generator._enum = _enum;
    generator._isEnumGenerator = true;

    return generator;
  }

  static parseEnum<T extends AnyEnumeration>(this: EnumerationClass<T>, value: EnumerationValue) {
    return this.allEnums().find((instance: T) => instance.value === value);
  }

  static allEnums<T extends AnyEnumeration>(this: EnumerationClass<T>): T[] {
    const properties = Object.keys(this);

    return properties
      .map((name) => (this as any)[name])
      .filter(
        (value): value is EnumerationGenerator<T> =>
          typeof value === 'function' && value?._isEnumGenerator,
      )
      .map((generator) => generator());
  }

  get type() {
    return this._type;
  }

  get value() {
    return this._value;
  }
}

export type AnyEnumeration = Enumeration;

export type EnumerationConstructorParams = ConstructorParameters<typeof Enumeration>;
