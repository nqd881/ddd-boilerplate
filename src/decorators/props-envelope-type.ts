import { AnyPropsEnvelope, GetProps } from '#core/props-envelope';
import { PropsMetadata } from '#metadata/props.metadata';
import { Class } from 'type-fest';

export const PropsEnvelopeType = <T extends AnyPropsEnvelope>(propsClass: Class<GetProps<T>>) => {
  return (target: Class<T>) => {
    PropsMetadata.definePropsMetadata(target, new PropsMetadata(propsClass));
  };
};
