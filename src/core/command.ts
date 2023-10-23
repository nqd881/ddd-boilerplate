import { ToObject } from '#decorators/to-object';
import { getCommandType } from '#metadata/command';
import { CommandClass } from '#types/command.type';
import { generateUUIDWithPrefix } from '#utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

@ToObject()
export class CommandMetadata {
  id: string;
  timestamp: number;
  correlationId?: string;
  causationId?: string;
}

export class CommandBase<P extends object> extends PropsEnvelope<CommandMetadata, P> {
  constructor(metadata: CommandMetadata, props: P) {
    super(metadata, props, true);
  }

  static newCommand<C extends AnyCommand>(
    this: CommandClass<C>,
    props: GetProps<C>,
    id?: string,
    correlationId?: string,
    causationId?: string,
  ) {
    const commandType = getCommandType(this.prototype);

    id = id ?? generateUUIDWithPrefix(commandType);

    return new this(
      {
        id,
        timestamp: Date.now(),
        correlationId,
        causationId,
      },
      props,
    );
  }

  @ToObject({ name: 'commandType', isMetadata: true })
  getCommandType() {
    const prototype = Object.getPrototypeOf(this);

    return getCommandType(prototype);
  }

  get id() {
    return this.metadata.id;
  }

  get timestamp() {
    return this.metadata.timestamp;
  }

  get correlationId() {
    return this.metadata?.correlationId;
  }

  get causationId() {
    return this.metadata?.causationId;
  }
}

export type AnyCommand = CommandBase<any>;
