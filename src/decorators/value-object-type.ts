import { GetProps } from '#core/props-envelope';
import { AnyValueObject } from '#core/value-object';
import { ValueObjectMetadata } from '#metadata/value-object.metadata';
import { ValueObjectClass } from '#types/value-object.type';
import { Class } from 'type-fest';
import { PropsEnvelopeType } from './props-envelope-type';

export const ValueObjectType = <T extends AnyValueObject>(
  propsClass: Class<GetProps<T>>,
  valueObjectType?: string,
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    ValueObjectMetadata.defineValueObjectMetadata(
      target,
      new ValueObjectMetadata(valueObjectType ?? target.name),
    );

    return PropsEnvelopeType(propsClass)(target);
  };
};
