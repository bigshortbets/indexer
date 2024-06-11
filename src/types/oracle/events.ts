import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const newFeedData =  {
    name: 'Oracle.NewFeedData',
    /**
     * New feed data is submitted.
     */
    v1: new EventType(
        'Oracle.NewFeedData',
        sts.struct({
            sender: v1.AccountId32,
            values: sts.array(() => sts.tuple(() => [sts.bigint(), sts.bigint()])),
        })
    ),
}
