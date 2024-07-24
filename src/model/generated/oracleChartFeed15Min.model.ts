import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigDecimalColumn as BigDecimalColumn_, BigIntColumn as BigIntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"

@Entity_()
export class OracleChartFeed15Min {
    constructor(props?: Partial<OracleChartFeed15Min>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigDecimalColumn_({nullable: false})
    closePrice!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    openPrice!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    lowPrice!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    highPrice!: BigDecimal

    @Index_()
    @BigIntColumn_({nullable: false})
    timestamp!: bigint

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market
}
