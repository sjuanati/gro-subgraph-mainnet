import { setUser } from '../setters/users'
import { setApprovalTx } from '../setters/approvals';
import { ApprovalEvent } from '../types/approval';
import { initTotals } from '../setters/totals';


export const manageApproval = (
    ev: ApprovalEvent,
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.ownerAddress);

    //Step 2: Manage Transaction
    setApprovalTx(ev, token);

    // Step 3: Create Totals for Approval-only users
    initTotals(ev.ownerAddress, true);
}
