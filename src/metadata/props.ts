import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { PROPS_METADATA } from './constants';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import 'reflect-metadata';
import { PropsMetadataHasNotBeenSetError } from './errors';

export interface PropsOptions {
  validatorOptions?: ValidatorOptions;
  transformOptions?: ClassTransformOptions;
}

export interface PropsMetadata<P> {
  propsClass: Class<P>;
  propsOptions?: PropsOptions;
}

export const definePropsMetadata = <T extends AnyPropsEnvelope>(
  target: object,
  metadata: PropsMetadata<GetProps<T>>,
) => {
  Reflect.defineMetadata(PROPS_METADATA, metadata, target);
};

export const getPropsMetadata = <T extends AnyPropsEnvelope>(
  target: object,
): PropsMetadata<GetProps<T>> => {
  const propsMetadata = Reflect.getMetadata(PROPS_METADATA, target);

  if (!propsMetadata) throw new PropsMetadataHasNotBeenSetError();

  return propsMetadata;
};
