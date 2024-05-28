import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
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

    @IntColumn_({nullable: false})
    balanceChange!: number

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market
}
