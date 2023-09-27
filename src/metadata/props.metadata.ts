import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Class } from 'type-fest';
import { PROPS_METADATA } from './constants';

export interface PropsOptions {
  transformOptions?: ClassTransformOptions;
  validatorOptions?: ValidatorOptions;
}

export interface PropsMetadata<P> {
  propsClass: Class<P>;
  options: PropsOptions;
}

export function definePropsMetadata<T extends AnyPropsEnvelope>(
  target: Class<T>,
  metadata: PropsMetadata<GetProps<T>>,
) {
  Reflect.defineMetadata(PROPS_METADATA, metadata, target);
}

export function getPropsMetadata<T extends AnyPropsEnvelope>(
  target: Class<T>,
): PropsMetadata<GetProps<T>> {
  return Reflect.getMetadata(PROPS_METADATA, target);
}
