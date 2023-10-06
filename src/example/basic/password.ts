import { ValueObjectBase } from '#core/value-object';
import { ToObject } from '#decorators/to-object';
import { ValueObject } from '#decorators/value-object';

export class PasswordProps {
  value: string;
  hashed: boolean;
}

@ValueObject(PasswordProps)
export class Password extends ValueObjectBase<PasswordProps> {
  @ToObject()
  get value() {
    return this.props.value;
  }

  @ToObject()
  get hashed() {
    return this.props.hashed;
  }
}
