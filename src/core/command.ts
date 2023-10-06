import { ToObject } from '#decorators/to-object';
import { getCommandType } from '#metadata/command';
import { CommandClass } from '#types/command.type';
import { generateUUIDWithPrefix } from 'src/utils';
import { GetProps, PropsEnvelopeWithId } from './props-envelope';

export class CommandBase<P extends object> extends PropsEnvelopeWithId<P> {
  @ToObject()
  private readonly _timestamp: number;

  @ToObject()
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
    id = generateUUIDWithPrefix(getCommandType(this.prototype));

    return new this(id, Date.now(), props, correlationId);
  }

  getCommandType() {
    return getCommandType(Object.getPrototypeOf(this));
  }

  setCorrelationId(correlationId: string) {
    if (this._correlationId) return;

    this._correlationId = correlationId;
  }

  @ToObject({ name: '_commandType' })
  get commandType() {
    return this.getCommandType();
  }

  get timestamp() {
    return this._timestamp;
  }

  get correlationId() {
    return this._correlationId;
  }
}

export type AnyCommand = CommandBase<any>;
