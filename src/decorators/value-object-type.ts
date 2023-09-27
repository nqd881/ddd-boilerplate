import { GetProps } from '#core/props-envelope';
import { AnyValueObject } from '#core/value-object';
import { PropsOptions } from '#metadata/props.metadata';
import { defineValueObjectMetadata } from '#metadata/value-object.metadata';
import { ValueObjectClass } from '#types/value-object.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const ValueObjectType = <T extends AnyValueObject>(
  propsClass: Class<GetProps<T>>,
  valueObjectType?: string,
  options?: PropsOptions,
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    defineValueObjectMetadata(target, {
      valueObjectType: valueObjectType ?? target.name,
    });

    return PropsEnvelopeType(propsClass, options)(target);
  };
};
