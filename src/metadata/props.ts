import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { PROPS_METADATA } from './constants';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import 'reflect-metadata';

export interface PropsOptions {
  validatorOptions?: ValidatorOptions;
  toPropsOptions?: ClassTransformOptions;
  toObjectOptions?: ClassTransformOptions;
}

export interface PropsMetadata<P> {
  propsClass: Class<P>;
  propsOptions?: PropsOptions;
}

export const definePropsMetadata = <T extends AnyPropsEnvelope>(
  target: Class<T>,
  metadata: PropsMetadata<GetProps<T>>,
) => {
  Reflect.defineMetadata(PROPS_METADATA, metadata, target);
};

export const getPropsMetadata = <T extends AnyPropsEnvelope>(
  target: Class<T>,
): PropsMetadata<GetProps<T>> => {
  return Reflect.getMetadata(PROPS_METADATA, target);
};
