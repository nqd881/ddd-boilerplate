import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { PROPS_METADATA } from './constants';

export class PropsMetadata<P> {
  constructor(public readonly propsClass: Class<P>) {}

  static definePropsMetadata<T extends AnyPropsEnvelope>(
    target: Class<T>,
    metadata: PropsMetadata<GetProps<T>>,
  ) {
    Reflect.defineMetadata(PROPS_METADATA, metadata, target);
  }

  static getPropsMetadata<T extends AnyPropsEnvelope>(
    target: Class<T>,
  ): PropsMetadata<GetProps<T>> {
    return Reflect.getMetadata(PROPS_METADATA, target);
  }
}
