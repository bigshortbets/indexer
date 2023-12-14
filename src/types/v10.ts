import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface TimestampedValue {
    value: bigint
    timestamp: bigint
}

export const TimestampedValue: sts.Type<TimestampedValue> = sts.struct(() => {
    return  {
        value: sts.bigint(),
        timestamp: sts.bigint(),
    }
})

export const AccountId32 = sts.bytes()
