import {sts, Result, Option, Bytes, BitSequence} from './support'

export const AccountId32 = sts.bytes()

export const OrderSide: sts.Type<OrderSide> = sts.closedEnum(() => {
    return  {
        Long: sts.unit(),
        Short: sts.unit(),
    }
})

export type OrderSide = OrderSide_Long | OrderSide_Short

export interface OrderSide_Long {
    __kind: 'Long'
}

export interface OrderSide_Short {
    __kind: 'Short'
}

export const Percent = sts.number()

export const BoundedVec = sts.bytes()
