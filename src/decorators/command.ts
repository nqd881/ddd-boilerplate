import { AnyCommand } from '#core/command';
import { GetProps } from '#core/props-envelope';
import { defineCommandType } from '#metadata/command';
import { PropsOptions, definePropsMetadata } from '#metadata/props';
import { CommandClass } from '#types/command.type';
import { Class } from 'type-fest';

export const Command = <E extends AnyCommand>(
  propsClass: Class<GetProps<E>>,
  commandType?: string,
  propsOptions?: PropsOptions,
) => {
  return <U extends CommandClass<E>>(target: U) => {
    definePropsMetadata(target.prototype, { propsClass, propsOptions });
    defineCommandType(target.prototype, commandType ?? target.name);
  };
};
