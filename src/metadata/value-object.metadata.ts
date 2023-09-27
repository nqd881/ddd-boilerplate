import { AnyValueObject } from '#core/value-object';
import { Class } from 'type-fest';
import { VALUE_OBJECT_METADATA } from './constants';

export interface ValueObjectMetadata {
  valueObjectType: string;
}

export function defineValueObjectMetadata<T extends AnyValueObject>(
  target: Class<T>,
  metadata: ValueObjectMetadata,
) {
  Reflect.defineMetadata(VALUE_OBJECT_METADATA, metadata, target);
}

export function getValueObjectMetadata<T extends AnyValueObject>(
  target: Class<T>,
): ValueObjectMetadata {
  return Reflect.getMetadata(VALUE_OBJECT_METADATA, target);
}
