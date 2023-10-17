import { Expose, ExposeOptions } from 'class-transformer';

export const ToObjectGroup = 'to_object_group';

export type ToObjectOptions = Omit<ExposeOptions, 'toClassOnly' | 'toPlainOnly'>;

export const ToObject = (options?: ToObjectOptions) => {
  return Expose({
    ...options,
    groups: [ToObjectGroup, ...(options?.groups ?? [])],
    toPlainOnly: true,
  });
};
