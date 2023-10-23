import { PropsOptions, definePropsOptions } from '#metadata/props';
import { Class } from 'type-fest';
import { ToObject } from './to-object';

export const Props = (options?: PropsOptions) => {
  return <U extends Class<any>>(target: U) => {
    definePropsOptions(target.prototype, options || {});

    ToObject()(target);
  };
};
