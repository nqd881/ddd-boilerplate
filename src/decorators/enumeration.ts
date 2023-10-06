import { AnyEnumeration, EnumerationValue } from '#core/enumeration';
import { defineEnumerationType } from '#metadata/enumeration';
import { EnumerationClass } from '#types/enumeration.type';

export const Enumeration = <T extends AnyEnumeration>(enumType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    defineEnumerationType(target.prototype, enumType ?? target.name);
  };
};

export const EnumValue = <T extends AnyEnumeration>(enumValue?: EnumerationValue) => {
  return <U extends EnumerationClass<T>>(target: U, propertyKey: string) => {
    if (!target[propertyKey]) target[propertyKey] = new target(enumValue ?? propertyKey);
  };
};
