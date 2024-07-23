import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigDecimalColumn as BigDecimalColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"

@Entity_()
export class OracleChartFeed1H {
    constructor(props?: Partial<OracleChartFeed1H>) {
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
    @IntColumn_({nullable: false})
    timestamp!: number

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market
}
