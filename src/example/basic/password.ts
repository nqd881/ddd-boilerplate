import { ValueObjectBase } from '#core/value-object';
import { ToObject } from '#decorators/to-object';
import { ValueObject } from '#decorators/value-object';

@ToObject()
export class PasswordProps {
  value: string;
  hashed: boolean;
}

@ValueObject(PasswordProps)
export class Password extends ValueObjectBase<PasswordProps> {
  get value() {
    return this.props.value;
  }

  get hashed() {
    return this.props.hashed;
  }
}
