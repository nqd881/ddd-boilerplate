import { AnyValueObject } from '#core/value-object';
import { Class } from 'type-fest';
import { VALUE_OBJECT_METADATA } from './constants';

export class ValueObjectMetadata {
  constructor(public readonly valueObjectType: string) {}

  static defineValueObjectMetadata<T extends AnyValueObject>(
    target: Class<T>,
    metadata: ValueObjectMetadata,
  ) {
    Reflect.defineMetadata(VALUE_OBJECT_METADATA, metadata, target);
  }

  static getValueObjectMetadata<T extends AnyValueObject>(target: Class<T>): ValueObjectMetadata {
    return Reflect.getMetadata(VALUE_OBJECT_METADATA, target);
  }
}
