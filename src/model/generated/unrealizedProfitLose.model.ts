import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Market} from "./market.model"

@Entity_()
export class UnrealizedProfitLose {
    constructor(props?: Partial<UnrealizedProfitLose>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("text", {nullable: false})
    user!: string
}
