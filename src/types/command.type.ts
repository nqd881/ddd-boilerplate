import { AnyCommand, CommandBase } from '#core/command';
import { GetProps } from '#core/props-envelope';
import { Class } from 'type-fest';
import { ClassTypeWithoutConstructorAndPrototype } from './common.type';

export type CommandConstructorParamsWithProps<P extends object> = ConstructorParameters<
  typeof CommandBase<P>
>;

export type CommandConstructorParams<T extends AnyCommand> = CommandConstructorParamsWithProps<
  GetProps<T>
>;

export type CommandClass<T extends AnyCommand> = Class<T, CommandConstructorParams<T>> &
  ClassTypeWithoutConstructorAndPrototype<typeof CommandBase<GetProps<T>>>;

export type CommandClassWithProps<P extends object> = CommandClass<CommandBase<P>>;

export type AnyCommandClass = CommandClass<AnyCommand>;
