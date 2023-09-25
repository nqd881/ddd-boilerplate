import { AnyPropsEnvelope, GetProps, Props, PropsEnvelope } from '#core/props-envelope';
import { Class } from 'type-fest';

export type PropsEnvelopeClass<T extends AnyPropsEnvelope> = Omit<
  typeof PropsEnvelope<GetProps<T>>,
  'constructor'
> &
  Class<T>;

export type PropsEnvelopeClassWithProps<P extends Props> = PropsEnvelopeClass<PropsEnvelope<P>>;
