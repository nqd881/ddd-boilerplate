import { Class } from 'type-fest';
import { COMMAND_TYPE } from './constants';
import { AnyCommand } from '#core/command';

export const defineCommandType = <T extends AnyCommand>(target: Class<T>, commandType: string) => {
  Reflect.defineMetadata(COMMAND_TYPE, commandType, target);
};

export const getCommandType = <T extends AnyCommand>(target: Class<T>): string => {
  return Reflect.getMetadata(COMMAND_TYPE, target);
};
