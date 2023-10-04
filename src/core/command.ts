import { getCommandType } from '#metadata/command';
import { CommandClass } from '#types/command.type';
import { generateUUIDWithPrefix } from 'src/utils/id';
import { GetProps, PropsEnvelope } from './props-envelope';

export class CommandBase<P extends object> extends PropsEnvelope<P> {
  private readonly _id: string;
  private readonly _timestamp: number;
  private _correlationId?: string;

  constructor(id: string, timestamp: number, props: P, correlationId?: string) {
    super(props, true);

    this._id = id;
    this._timestamp = timestamp;
    this._correlationId = correlationId;
  }

  static newCommand<C extends AnyCommand>(
    this: CommandClass<C>,
    props: GetProps<C>,
    id = generateUUIDWithPrefix(getCommandType(this)),
    correlationId?: string,
  ) {
    return new this(id, Date.now(), props, correlationId);
  }

  setCorrelationId(correlationId: string) {
    if (this._correlationId) return;

    this._correlationId = correlationId;
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get correlationId() {
    return this._correlationId;
  }
}

export type AnyCommand = CommandBase<any>;
