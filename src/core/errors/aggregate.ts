export class NonNegativeVersionError extends Error {
  constructor() {
    super('Version must be set with non-negative number');
  }
}

export class EventApplierNotFoundError extends Error {
  constructor(eventType: string) {
    super(`Not found event applier for event with type ${eventType}`);
  }
}

export class CommandHandlerNotFoundError extends Error {
  constructor(commandType: string) {
    super(`Not found command handler for command with type ${commandType}`);
  }
}
