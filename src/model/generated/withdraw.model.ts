import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {WidthdrawStatus} from "./_widthdrawStatus"

@Entity_()
export class Withdraw {
    constructor(props?: Partial<Withdraw>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("text", {nullable: false})
    user!: string

    @Column_("varchar", {length: 9, nullable: false})
    status!: WidthdrawStatus
}
