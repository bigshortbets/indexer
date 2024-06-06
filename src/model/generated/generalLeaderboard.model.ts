import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigDecimalColumn as BigDecimalColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class GeneralLeaderboard {
    constructor(props?: Partial<GeneralLeaderboard>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @BigDecimalColumn_({nullable: false})
    balanceChange!: BigDecimal
}
