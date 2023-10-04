import { v4 } from 'uuid';

export const generateUUIDWithPrefix = (prefix: string) => {
  return `${prefix}#${v4()}`;
};
