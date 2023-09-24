import { AnyValueObject, GetValueObjectProps } from '#core/value-object';
import { ValueObjectMetadata } from '#metadata/value-object.metadata';
import { ValueObjectClass } from '#types/value-object.type';
import 'reflect-metadata';
import { Class } from 'type-fest';

export const ValueObjectType = <T extends AnyValueObject>(
  propsClass: Class<GetValueObjectProps<T>>,
  valueObjectType?: string,
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    ValueObjectMetadata.defineValueObjectMetadata(
      target,
      new ValueObjectMetadata(valueObjectType ?? target.name, propsClass),
    );
  };
};
