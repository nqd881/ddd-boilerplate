import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { PropsOptions, definePropsMetadata } from '#metadata/props.metadata';
import { Class } from 'type-fest';

export const PropsEnvelopeType = <T extends AnyPropsEnvelope>(
  propsClass: Class<GetProps<T>>,
  options?: PropsOptions,
) => {
  return (target: Class<T>) => {
    definePropsMetadata(target, {
      propsClass,
      options: options ?? {},
    });
  };
};
