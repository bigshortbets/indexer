import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigDecimalColumn as BigDecimalColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"

@Entity_()
export class UserBalance {
    constructor(props?: Partial<UserBalance>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    user!: string

    @BigDecimalColumn_({nullable: false})
    balanceChange!: BigDecimal

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market
}
