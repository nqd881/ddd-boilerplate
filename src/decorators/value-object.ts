import { GetProps } from '#core/props-envelope';
import { AnyValueObject } from '#core/value-object';
import { definePropsClass } from '#metadata/props';
import { ValueObjectRegistry, defineValueObjectType } from '#metadata/value-object';
import { ValueObjectClass } from '#types/value-object.type';
import { Class } from 'type-fest';

export const ValueObject = <T extends AnyValueObject>(
  propsClass: Class<GetProps<T>>,
  valueObjectType?: string,
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    valueObjectType = valueObjectType ?? target.name;

    definePropsClass(target.prototype, propsClass);
    defineValueObjectType(target.prototype, valueObjectType);

    ValueObjectRegistry.register(valueObjectType, target);
  };
};
