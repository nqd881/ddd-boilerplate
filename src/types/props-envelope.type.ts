import { AnyPropsEnvelope, GetProps, PropsEnvelope } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type PropsEnvelopeClass<T extends AnyPropsEnvelope> = Class<T> &
  ClassTypeWithoutConstructorAndPrototype<typeof PropsEnvelope<GetProps<T>>>;

export type PropsEnvelopeClassWithProps<P extends object> = PropsEnvelopeClass<PropsEnvelope<P>>;
