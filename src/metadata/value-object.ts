import { AnyValueObject } from '#core/value-object';
import { Class } from 'type-fest';
import { VALUE_OBJECT_TYPE } from './constants';
import { ValueObjectTypeHasNotBeenSetError } from './errors';
import { Registry } from './registry';

export const ValueObjectRegistry = new Registry<Class<AnyValueObject>>();

export const defineValueObjectType = (target: object, eventType: string) => {
  Reflect.defineMetadata(VALUE_OBJECT_TYPE, eventType, target);
};

export const getValueObjectType = (target: object): string => {
  const type = Reflect.getMetadata(VALUE_OBJECT_TYPE, target);

  if (!type) throw new ValueObjectTypeHasNotBeenSetError();

  return type;
};
