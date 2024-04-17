import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {WidthdrawStatus} from "./_widthdrawStatus"

@Entity_()
export class Withdraw {
    constructor(props?: Partial<Withdraw>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @StringColumn_({nullable: false})
    user!: string

    @Column_("varchar", {length: 9, nullable: false})
    status!: WidthdrawStatus
}
