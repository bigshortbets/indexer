import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2 from '../v2'

export const reserveRepatriated =  {
    name: 'Balances.ReserveRepatriated',
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    v2: new EventType(
        'Balances.ReserveRepatriated',
        sts.struct({
            from: v2.AccountId32,
            to: v2.AccountId32,
            amount: sts.bigint(),
            destinationStatus: v2.BalanceStatus,
        })
    ),
}
