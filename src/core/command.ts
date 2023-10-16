import { ToObject } from '#decorators/to-object';
import { getCommandType } from '#metadata/command';
import { CommandClass } from '#types/command.type';
import { generateUUIDWithPrefix } from 'src/utils';
import { GetProps, PropsEnvelopeWithId } from './props-envelope';

export class CommandBase<P extends object> extends PropsEnvelopeWithId<P> {
  private readonly _timestamp: number;
  private _correlationId?: string;

  constructor(id: string, timestamp: number, props: P, correlationId?: string) {
    super(id, props, true);

    this._timestamp = timestamp;
    this._correlationId = correlationId;
  }

  static newCommand<C extends AnyCommand>(
    this: CommandClass<C>,
    props: GetProps<C>,
    id?: string,
    correlationId?: string,
  ) {
    const commandType = getCommandType(this.prototype);

    id = id ?? generateUUIDWithPrefix(commandType);

    return new this(id, Date.now(), props, correlationId);
  }

  getCommandType() {
    const prototype = Object.getPrototypeOf(this);

    return getCommandType(prototype);
  }

  setCorrelationId(correlationId: string) {
    if (this._correlationId) return;

    this._correlationId = correlationId;
  }

  @ToObject()
  get commandType() {
    return this.getCommandType();
  }

  @ToObject()
  get timestamp() {
    return this._timestamp;
  }

  @ToObject()
  get correlationId() {
    return this._correlationId;
  }
}

export type AnyCommand = CommandBase<any>;
