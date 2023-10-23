import { Expose, ExposeOptions } from 'class-transformer';

export const ToObjectGroup = 'to_object_group';

export type ToObjectOptions = Omit<ExposeOptions, 'toClassOnly' | 'toPlainOnly'> & {
  isMetadata?: boolean;
  isProps?: boolean;
};

export const ToObject = (options?: ToObjectOptions) => {
  const { name, since, until, groups, isMetadata, isProps } = options || {};

  return Expose({
    name: isMetadata ? `metadata.${name}` : isProps ? `props.${name}` : name,
    since,
    until,
    groups: [ToObjectGroup, ...(groups ?? [])],
    toPlainOnly: true,
  });
};
