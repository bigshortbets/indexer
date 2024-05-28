import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigDecimalColumn as BigDecimalColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"

@Entity_()
export class ReserveRepatriated {
    constructor(props?: Partial<ReserveRepatriated>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigDecimalColumn_({nullable: false})
    amount!: BigDecimal

    @Index_()
    @StringColumn_({nullable: false})
    user!: string

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
