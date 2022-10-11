import { PoolBalanceChanged } from '../../generated/BalancerGroWethVault/Vault';
import { Transfer } from '../../generated/BalancerGroWethPool/ERC20';
import { 
    setWethPrice, 
    setBalancerGroWethPrice
} from '../setters/price';
import {getTxData } from '../utils/tx';


// Not using if because there aren't balance changes in our poolId.
// if (event.params.poolId == BALANCER_GRO_WETH_POOLID) {}
export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
}

export function handleTransfer(event: Transfer): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
}

// Way too many swaps -> not feasible
// export function handleSwap(event: Swap): void {
//     if (event.params.poolId == BALANCER_GRO_WETH_POOLID) {
//         setBalancerGroWethPrice();
//         log.error('** handlePoolBalanceChanged INSIDE {}', [event.params.poolId.toHexString()]);
//     } else {
//         //log.error('** handlePoolBalanceChanged OUTSIDE {}', [event.params.poolId.toString()]);
//     }
// }