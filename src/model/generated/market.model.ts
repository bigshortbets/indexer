import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Market {
    constructor(props?: Partial<Market>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    ticker!: string

    @BigIntColumn_({nullable: false})
    tickSize!: bigint

    @BigIntColumn_({nullable: false})
    lifetime!: bigint

    @IntColumn_({nullable: false})
    initialMargin!: number

    @IntColumn_({nullable: false})
    maintenanceMargin!: number

    @BigIntColumn_({nullable: false})
    contractUnit!: bigint

    @BigIntColumn_({nullable: false})
    blockHeight!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    dailyVolume!: bigint

    @BigIntColumn_({nullable: true})
    oraclePrice!: bigint | undefined | null
}
