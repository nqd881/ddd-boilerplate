import { ToObject } from '#decorators/to-object';
import { getCommandType } from '#metadata/command';
import { CommandClass } from '#types/command.type';
import { generateUUIDWithPrefix } from '#utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

export interface ICommandMetadata {
  id: string;
  timestamp: number;
  correlationId?: string;
  causationId?: string;
}
export class CommandMetadata implements ICommandMetadata {
  private _id: string;
  private _timestamp: number;
  private _correlationId?: string;
  private _causationId?: string;

  constructor(metadata: ICommandMetadata) {
    if (metadata) {
      this._id = metadata.id;
      this._timestamp = metadata.timestamp;
      this._correlationId = metadata.correlationId;
      this._causationId = metadata.causationId;
    }
  }

  @ToObject()
  get id() {
    return this._id;
  }

  @ToObject()
  get timestamp() {
    return this._timestamp;
  }

  @ToObject()
  get correlationId() {
    return this._correlationId;
  }

  @ToObject()
  get causationId() {
    return this._causationId;
  }

  setCorrelationId(correlationId: string) {
    if (!this._correlationId) this._correlationId = correlationId;
  }

  setCausationId(causationId: string) {
    if (!this._causationId) this._causationId = causationId;
  }
}

export class CommandBase<P extends object> extends PropsEnvelope<CommandMetadata, P> {
  constructor(metadata: ICommandMetadata, props: P) {
    super(new CommandMetadata(metadata), props, true);
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
}

export type AnyCommand = CommandBase<any>;
