import { Class } from 'type-fest';

export type ClassTypeWithoutConstructorAndPrototype<T extends Class<any>> = Omit<
  T,
  'constructor' | 'prototype'
>;
