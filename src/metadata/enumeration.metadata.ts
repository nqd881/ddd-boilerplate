import { AnyEnumeration } from '#core/enumeration';
import { Class } from 'type-fest';
import { ENUMERATION_METADATA } from './constants';

export class EnumerationMetadata {
  constructor(public readonly enumType: string) {}

  static defineEnumerationMetadata<T extends AnyEnumeration>(
    target: Class<T>,
    metadata: EnumerationMetadata,
  ) {
    Reflect.defineMetadata(ENUMERATION_METADATA, metadata, target);
  }

  static getEnumerationMetadata<T extends AnyEnumeration>(target: Class<T>): EnumerationMetadata {
    return Reflect.getMetadata(ENUMERATION_METADATA, target);
  }
}
