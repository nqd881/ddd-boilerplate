import { ValueObject } from '#core/value-object';
import { ValueObjectType } from 'src/decorators/value-object-type';

export type PasswordProps = {
  value: string;
  hashed: boolean;
};

@ValueObjectType()
export class Password extends ValueObject<PasswordProps> {
  validateProps(props: PasswordProps): void {}
}
