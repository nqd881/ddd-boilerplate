import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import 'reflect-metadata';
import { Class } from 'type-fest';
import { PROPS_CLASS, PROPS_OPTIONS } from './constants';
import { PropsClassHasNotBeenSetError } from './errors';

export interface PropsOptions {
  validatorOptions?: ValidatorOptions;
  transformOptions?: ClassTransformOptions;
}

export const definePropsClass = <T extends AnyPropsEnvelope>(
  target: object,
  propsClass: Class<GetProps<T>>,
) => {
  Reflect.defineMetadata(PROPS_CLASS, propsClass, target);
};

export const getPropsClass = <T extends AnyPropsEnvelope>(target: object): Class<GetProps<T>> => {
  const propsClass = Reflect.getMetadata(PROPS_CLASS, target);

  if (!propsClass) throw new PropsClassHasNotBeenSetError();

  return propsClass;
};

export const definePropsOptions = (target: object, options: PropsOptions) => {
  Reflect.defineMetadata(PROPS_OPTIONS, options, target);
};

export const getPropsOptions = (target: object): PropsOptions => {
  return Reflect.getMetadata(PROPS_OPTIONS, target) || {};
};
