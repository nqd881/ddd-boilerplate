export class HasNotBeenSetError extends Error {
  constructor(x: string) {
    super(`The ${x} has not been set`);
  }
}

export class AggregateTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('aggregate type');
  }
}

export class CommandTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('command type');
  }
}

export class EntityTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('entity type');
  }
}

export class EnumerationTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('enumeration type');
  }
}

export class ValueObjectTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('value object type');
  }
}

export class PropsClassHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('props class');
  }
}

export class MetadataClassHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super('metadata class');
  }
}
