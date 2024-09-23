import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigDecimalColumn as BigDecimalColumn_, BigIntColumn as BigIntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"

@Entity_()
export class MarketChartFeed1H {
    constructor(props?: Partial<MarketChartFeed1H>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigDecimalColumn_({nullable: false})
    close!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    open!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    low!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    high!: BigDecimal

    @Index_()
    @BigIntColumn_({nullable: false})
    time!: bigint

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market
}
