import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v14 from '../v14'
import * as v18 from '../v18'

export const withdrawRequested =  {
    name: 'Bridge.WithdrawRequested',
    /**
     * Bridge withdrawal request
     */
    v14: new EventType(
        'Bridge.WithdrawRequested',
        sts.struct({
            identifier: sts.bigint(),
            amount: sts.bigint(),
            user: v14.H160,
        })
    ),
}

export const withdrawCanceled =  {
    name: 'Bridge.WithdrawCanceled',
    /**
     * Bridge withdrawal canceled
     */
    v14: new EventType(
        'Bridge.WithdrawCanceled',
        sts.struct({
            identifier: sts.bigint(),
        })
    ),
}

export const withdrawApproved =  {
    name: 'Bridge.WithdrawApproved',
    /**
     * Bridge withdrawal approved
     */
    v15: new EventType(
        'Bridge.WithdrawApproved',
        sts.struct({
            identifier: sts.bigint(),
        })
    ),
    /**
     * Bridge withdrawal approved
     */
    v18: new EventType(
        'Bridge.WithdrawApproved',
        sts.struct({
            identifier: sts.bigint(),
            amount: sts.bigint(),
            user: v18.H160,
        })
    ),
}
