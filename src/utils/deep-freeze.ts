import { isObject } from 'lodash';

export const deepFreeze = <T extends object>(obj: T) => {
  Object.keys(obj).forEach((prop) => {
    if (isObject(obj[prop]) && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop] as object);
    }
  });

  return Object.freeze(obj);
};
