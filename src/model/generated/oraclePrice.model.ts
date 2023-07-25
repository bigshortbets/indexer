import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Market} from "./market.model"

@Entity_()
export class OraclePrice {
    constructor(props?: Partial<OraclePrice>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockHeight!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
