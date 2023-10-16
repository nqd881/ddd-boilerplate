import { COMMAND_TYPE } from './constants';
import { CommandTypeHasNotBeenSetError } from './errors';

export const defineCommandType = (target: object, commandType: string) => {
  Reflect.defineMetadata(COMMAND_TYPE, commandType, target);
};

export const getCommandType = (target: object): string => {
  const commandType = Reflect.getMetadata(COMMAND_TYPE, target);

  if (!commandType) throw new CommandTypeHasNotBeenSetError();

  return commandType;
};
