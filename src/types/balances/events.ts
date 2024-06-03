import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const reserveRepatriated =  {
    name: 'Balances.ReserveRepatriated',
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    v1: new EventType(
        'Balances.ReserveRepatriated',
        sts.struct({
            from: v1.AccountId32,
            to: v1.AccountId32,
            amount: sts.bigint(),
            destinationStatus: v1.BalanceStatus,
        })
    ),
}
