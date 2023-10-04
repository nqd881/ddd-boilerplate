import { Class } from 'type-fest';
import { VALUE_OBJECT_TYPE } from './constants';
import { AnyValueObject } from '#core/value-object';

export const defineValueObjectType = <T extends AnyValueObject>(
  target: Class<T>,
  eventType: string,
) => {
  Reflect.defineMetadata(VALUE_OBJECT_TYPE, eventType, target);
};

export const getValueObjectType = <T extends AnyValueObject>(target: Class<T>): string => {
  return Reflect.getMetadata(VALUE_OBJECT_TYPE, target);
};
