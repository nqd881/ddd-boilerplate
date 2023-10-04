import { EnumerationBase } from '#core/enumeration';
import { Enumeration } from '#decorators/enumeration';

@Enumeration()
export class AccountStatus extends EnumerationBase {
  static ActivatePending = new AccountStatus('ActivatePending');
  static Activated = new AccountStatus('Activated');
}
