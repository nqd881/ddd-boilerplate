import { ValueObject } from '#core/value-object';
import { ValueObjectType } from 'src/decorators/value-object-type';

export class PasswordProps {
  value: string;
  hashed: boolean;
}

@ValueObjectType(PasswordProps)
export class Password extends ValueObject<PasswordProps> {
  validateProps(props: PasswordProps): void {}

  get value() {
    return this._props.value;
  }

  get hashed() {
    return this._props.hashed;
  }
}
