import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';
import { 
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx
} from '../setters/depowithdraw';


/// @notice Manages core withdrawals from WithdrawtHandler (pre-G2) and GRouter (post-G2)
/// @param ev the parsed withdrawal event
/// @param logs the logs within the withdrawal transaction
/// @param token the withdrawal token (gvt or pwrd)
export const manageCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {
    // Creates user if not existing yet
    setUser(ev.userAddress);

    // Stores withdrawal tx
    const tx = setDepoWithdrawTx(ev, logs, token);

    // Updates user totals
    setTotals(
        tx.type,
        token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Updates total supply
    updateTotalSupply(
        'withdrawal',
        tx.coin_amount,
        token,
    );

    // Updates GToken factor
    if (token === 'pwrd') {
        setPwrdFactor();
    } else if (token === 'gvt') {
        setGvtFactor();
    }
}

/// @notice Manages staker withdrawals
/// @param ev the parsed withdrawal event
export const manageStakerWithdrawal = (
    ev: DepoWithdraw,
    isEmergencyWithdrawal: boolean
): void => {
    // Creates user if not existing yet
    setUser(ev.userAddress);

    // Stores staker withdrawal tx
    const tx = setStakerDepoWithdrawTx(ev, isEmergencyWithdrawal);

    // Updates user-related pool data
    setPools(
        tx.type,
        tx.user_address,
        tx.pool_id,
        tx.contract_address,
        tx.coin_amount,
    );

    // Creates user totals if not existing yet (e.g.: a user that didn't do
    // any deposit or withdrawal before staking)
    initTotals(ev.userAddress, true);
}
