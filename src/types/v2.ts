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

export const OrderType: sts.Type<OrderType> = sts.closedEnum(() => {
    return  {
        Offsetting: sts.bigint(),
        Opening: sts.unit(),
    }
})

export type OrderType = OrderType_Offsetting | OrderType_Opening

export interface OrderType_Offsetting {
    __kind: 'Offsetting'
    value: bigint
}

export interface OrderType_Opening {
    __kind: 'Opening'
}

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

export const ContractUnit: sts.Type<ContractUnit> = sts.struct(() => {
    return  {
        contractUnit: sts.number(),
        decimals: sts.number(),
    }
})

export interface ContractUnit {
    contractUnit: number
    decimals: number
}

export const Percent = sts.number()

export const H160 = sts.bytes()

export const BalanceStatus: sts.Type<BalanceStatus> = sts.closedEnum(() => {
    return  {
        Free: sts.unit(),
        Reserved: sts.unit(),
    }
})

export type BalanceStatus = BalanceStatus_Free | BalanceStatus_Reserved

export interface BalanceStatus_Free {
    __kind: 'Free'
}

export interface BalanceStatus_Reserved {
    __kind: 'Reserved'
}

export const AccountId32 = sts.bytes()
