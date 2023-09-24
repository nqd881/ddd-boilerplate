import { Enumeration } from '#core/enumeration';
import { EnumerationType } from 'src/decorators/enumeration-type';

@EnumerationType()
export class AccountStatus extends Enumeration {
  static ActivatePending = new AccountStatus('ActivatePending');
  static Activated = new AccountStatus('Activated');
}
