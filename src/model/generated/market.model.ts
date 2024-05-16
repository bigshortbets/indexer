import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigDecimalColumn as BigDecimalColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {MarketStatus} from "./_marketStatus"

@Entity_()
export class Market {
    constructor(props?: Partial<Market>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    ticker!: string

    @BigDecimalColumn_({nullable: false})
    tickSize!: BigDecimal

    @BigIntColumn_({nullable: false})
    lifetime!: bigint

    @IntColumn_({nullable: false})
    initialMargin!: number

    @IntColumn_({nullable: false})
    maintenanceMargin!: number

    @BigDecimalColumn_({nullable: false})
    contractUnit!: BigDecimal

    @BigIntColumn_({nullable: false})
    blockHeight!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    dailyVolume!: bigint

    @BigDecimalColumn_({nullable: true})
    oraclePrice!: BigDecimal | undefined | null

    @Column_("varchar", {length: 5, nullable: false})
    status!: MarketStatus
}
