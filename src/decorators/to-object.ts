import { Expose, ExposeOptions } from 'class-transformer';

export type ToObjectOptions = Omit<ExposeOptions, 'toClassOnly' | 'toPlainOnly'>;

export const ToObject = (options?: ToObjectOptions) => {
  return Expose({
    ...options,
    toPlainOnly: true,
  });
};
