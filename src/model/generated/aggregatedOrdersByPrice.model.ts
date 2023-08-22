import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Market} from "./market.model"

@Entity_()
export class AggregatedOrdersByPrice {
    constructor(props?: Partial<AggregatedOrdersByPrice>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    quantity!: bigint

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("text", {nullable: false})
    side!: string
}
