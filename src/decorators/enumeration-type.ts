import { AnyEnumeration } from '#core/enumeration';
import { EnumerationMetadata } from '#metadata/enumeration.metadata';
import { EnumerationClass } from '#types/enumeration.type';

export const EnumerationType = <T extends AnyEnumeration>(enumType?: string) => {
  return <U extends EnumerationClass<T>>(target: U) => {
    EnumerationMetadata.defineEnumerationMetadata(
      target,
      new EnumerationMetadata(enumType ?? target.name),
    );
  };
};
