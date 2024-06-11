import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const withdrawRequested =  {
    name: 'Bridge.WithdrawRequested',
    /**
     * Bridge withdrawal request
     */
    v1: new EventType(
        'Bridge.WithdrawRequested',
        sts.struct({
            identifier: sts.bigint(),
            amount: sts.bigint(),
            user: v1.H160,
        })
    ),
}

export const withdrawApproved =  {
    name: 'Bridge.WithdrawApproved',
    /**
     * Bridge withdrawal approved
     */
    v1: new EventType(
        'Bridge.WithdrawApproved',
        sts.struct({
            identifier: sts.bigint(),
            amount: sts.bigint(),
            user: v1.H160,
        })
    ),
}

export const withdrawCanceled =  {
    name: 'Bridge.WithdrawCanceled',
    /**
     * Bridge withdrawal canceled
     */
    v1: new EventType(
        'Bridge.WithdrawCanceled',
        sts.struct({
            identifier: sts.bigint(),
        })
    ),
}
