import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v10 from '../v10'

export const newFeedData =  {
    name: 'Oracle.NewFeedData',
    /**
     * New feed data is submitted.
     */
    v1: new EventType(
        'Oracle.NewFeedData',
        sts.struct({
            sender: v1.AccountId32,
            values: sts.array(() => sts.tuple(() => [v1.BoundedVec, sts.bigint()])),
        })
    ),
    /**
     * New feed data is submitted.
     */
    v10: new EventType(
        'Oracle.NewFeedData',
        sts.struct({
            sender: v10.AccountId32,
            values: sts.array(() => sts.tuple(() => [sts.bigint(), sts.bigint()])),
        })
    ),
}
