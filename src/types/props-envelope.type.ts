import { AnyPropsEnvelope, GetMetadata, GetProps, PropsEnvelope } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type PropsEnvelopeClass<T extends AnyPropsEnvelope> = Class<T> &
  ClassTypeWithoutConstructorAndPrototype<typeof PropsEnvelope<GetMetadata<T>, GetProps<T>>>;

export type PropsEnvelopeClassWithMetadataAndProps<
  M extends object,
  P extends object,
> = PropsEnvelopeClass<PropsEnvelope<M, P>>;
