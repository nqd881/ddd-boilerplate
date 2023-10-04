import { AnyEnumeration } from '#core/enumeration';
import { defineEnumerationType } from '#metadata/enumeration';
import { EnumerationClass } from '#types/enumeration.type';

export const Enumeration = <T extends AnyEnumeration>(enumType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    defineEnumerationType(target, enumType ?? target.name);
  };
};
