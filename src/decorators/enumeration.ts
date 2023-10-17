import { AnyEnumeration, EnumerationValue } from '#core/enumeration';
import { EnumerationRegistry, defineEnumerationType } from '#metadata/enumeration';
import { EnumerationClass } from '#types/enumeration.type';

export const Enumeration = <T extends AnyEnumeration>(enumType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    enumType = enumType ?? target.name;

    defineEnumerationType(target.prototype, enumType);

    EnumerationRegistry.register(enumType, target);
  };
};

export const EnumValue = <T extends AnyEnumeration>(enumValue?: EnumerationValue) => {
  return <U extends EnumerationClass<T>>(target: U, propertyKey: string) => {
    if (!target[propertyKey]) target[propertyKey] = new target(enumValue ?? propertyKey);
  };
};
