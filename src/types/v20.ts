import {sts, Result, Option, Bytes, BitSequence} from './support'

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
