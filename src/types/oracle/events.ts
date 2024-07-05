import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2 from '../v2'

export const newFeedData =  {
    name: 'Oracle.NewFeedData',
    /**
     * New feed data is submitted.
     */
    v2: new EventType(
        'Oracle.NewFeedData',
        sts.struct({
            sender: v2.AccountId32,
            values: sts.array(() => sts.tuple(() => [sts.bigint(), sts.bigint()])),
        })
    ),
}
