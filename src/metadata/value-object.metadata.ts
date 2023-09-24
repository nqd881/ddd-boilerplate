import { AnyValueObject, GetValueObjectProps } from '#core/value-object';
import { Class } from 'type-fest';
import { VALUE_OBJECT_METADATA } from './constants';

export class ValueObjectMetadata<P> {
  constructor(public readonly valueObjectType: string, public readonly propsClass: Class<P>) {}

  static defineValueObjectMetadata<T extends AnyValueObject>(
    target: Class<T>,
    metadata: ValueObjectMetadata<GetValueObjectProps<T>>,
  ) {
    Reflect.defineMetadata(VALUE_OBJECT_METADATA, metadata, target);
  }

  static getValueObjectMetadata<T extends AnyValueObject>(
    target: Class<T>,
  ): ValueObjectMetadata<GetValueObjectProps<T>> {
    return Reflect.getMetadata(VALUE_OBJECT_METADATA, target);
  }
}
