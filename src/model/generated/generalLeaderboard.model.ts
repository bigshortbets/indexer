import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigDecimalColumn as BigDecimalColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class GeneralLeaderboard {
    constructor(props?: Partial<GeneralLeaderboard>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    user!: string

    @BigDecimalColumn_({nullable: false})
    balanceChange!: BigDecimal
}
