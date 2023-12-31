// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Manages withdrawal events from EmergencyHandler by:
///     - Storing the core withdrawal transaction
///     - Updating the user's balance
///     - Updating the total supply
///     - Updating the gvt/pwrd factors

import { Log } from '../types/log';
import { setTotals } from '../setters/totals';
import { updateFactor } from '../setters/factors';
import {
    NUM,
    TOKEN as Token,
} from '../utils/constants';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import { setEmergencyWithdrawTx } from '../setters/depowithdraw';


/// @notice Manages emergency core withdrawals from EmergencytHandler (pre-G2)
/// @param ev the parsed withdrawal event
/// @param logs the logs within the withdrawal transaction
export const manageEmergencyCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
): void => {
    // Stores withdrawal tx in entity <TransferTx>
    const tx = setEmergencyWithdrawTx(ev, logs);

    // Updates user totals in entity <Totals>
    setTotals(
        tx.type,
        tx.token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Updates total supply in entity <CoreData>
    updateTotalSupply(
        tx.coin_amount.times(NUM.MINUS_ONE),
        tx.token,
    );

    // Updates GToken factor in entity <Factor>
    if (tx.token === Token.PWRD) {
        updateFactor(Token.PWRD);
    } else if (tx.token === Token.GVT) {
        updateFactor(Token.GVT);
    }
}
