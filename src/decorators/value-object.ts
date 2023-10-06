import { GetProps } from '#core/props-envelope';
import { AnyValueObject } from '#core/value-object';
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { defineValueObjectType } from '#metadata/value-object';
import { ValueObjectClass } from '#types/value-object.type';
import { Class } from 'type-fest';

export const ValueObject = <T extends AnyValueObject>(
  propsClass: Class<GetProps<T>>,
  valueObjectType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    definePropsMetadata(target.prototype, { propsClass, propsOptions });
    defineValueObjectType(target.prototype, valueObjectType ?? target.name);
  };
};
