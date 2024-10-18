import {sts, Result, Option, Bytes, BitSequence} from './support'

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
