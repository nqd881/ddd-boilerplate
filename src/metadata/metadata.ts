import { Class } from 'type-fest';
import { METADATA_CLASS } from './constants';
import { MetadataClassHasNotBeenSetError } from './errors';

export const defineMetadataClass = (target: object, metadataClass: Class<any>) => {
  Reflect.defineMetadata(METADATA_CLASS, metadataClass, target);
};

export const getMetadataClass = (target: object): Class<any> => {
  const metadataClass = Reflect.getMetadata(METADATA_CLASS, target);

  if (!metadataClass) throw new MetadataClassHasNotBeenSetError();

  return metadataClass;
};
