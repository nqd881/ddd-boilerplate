import { EnumerationBase } from '#core/enumeration';
import { EnumValue, Enumeration } from '#decorators/enumeration';

@Enumeration()
export class AccountStatus extends EnumerationBase {
  @EnumValue('activate-pending')
  static ActivatePending: AccountStatus;

  static Activated = new AccountStatus('activated');
}
