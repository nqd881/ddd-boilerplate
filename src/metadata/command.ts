import { COMMAND_TYPE } from './constants';

export const defineCommandType = (target: object, commandType: string) => {
  Reflect.defineMetadata(COMMAND_TYPE, commandType, target);
};

export const getCommandType = (target: object): string => {
  return Reflect.getMetadata(COMMAND_TYPE, target);
};
