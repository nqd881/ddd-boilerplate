import { Enumeration } from '#core/enumeration';
import { EnumerationType } from 'src/decorators/enumeration-type';

@EnumerationType()
export class AccountStatus extends Enumeration {
  static ActivatePending = AccountStatus.newEnum('ActivatePending');
  static Activated = AccountStatus.newEnum('Activated');
}
