import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigDecimalColumn as BigDecimalColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"
import {PositionStatus} from "./_positionStatus"

@Entity_()
export class Position {
    constructor(props?: Partial<Position>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @BigDecimalColumn_({nullable: false})
    createPrice!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    createPriceLong!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    createPriceShort!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    price!: BigDecimal

    @BigIntColumn_({nullable: false})
    quantity!: bigint

    @BigIntColumn_({nullable: false})
    quantityLeft!: bigint

    @StringColumn_({nullable: false})
    long!: string

    @StringColumn_({nullable: false})
    short!: string

    @BigIntColumn_({nullable: false})
    blockHeight!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Column_("varchar", {length: 6, nullable: true})
    status!: PositionStatus | undefined | null
}
