export class UninitializedError extends Error {
  constructor() {
    super('PropsEnvelope must be initialized before');
  }
}

export class PropsClassNotFoundError extends Error {
  constructor() {
    super('Props class not found in metadata');
  }
}

export class ValidatePropsFailedError extends Error {
  constructor() {
    super('Validate props failed');
  }
}

export class UpdateImmutablePropsError extends Error {
  constructor() {
    super('Cannot update immutable props');
  }
}
