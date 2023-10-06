import { isObject } from 'lodash';

export const deepFreeze = <T extends object>(obj: T) => {
  Object.keys(obj).forEach((prop) => {
    let p = prop as keyof T;

    if (isObject(obj[p]) && !Object.isFrozen(obj[p])) {
      deepFreeze(obj[p] as object);
    }
  });

  return Object.freeze(obj);
};
