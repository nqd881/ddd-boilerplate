import { AnyEnumeration } from '#core/enumeration';
import { defineEnumerationMetadata } from '#metadata/enumeration.metadata';
import { EnumerationClass } from '#types/enumeration.type';

export const EnumerationType = <T extends AnyEnumeration>(enumType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    defineEnumerationMetadata(target, {
      enumType: enumType ?? target.name,
    });
  };
};
