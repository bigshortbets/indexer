import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Market} from "./market.model"
import {OrderSide} from "./_orderSide"
import {OrderStatus} from "./_orderStatus"

@Entity_()
export class Order {
    constructor(props?: Partial<Order>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Column_("int4", {nullable: false})
    quantity!: number

    @Column_("varchar", {length: 5, nullable: false})
    side!: OrderSide

    @Column_("text", {nullable: true})
    who!: string | undefined | null

    @Column_("int4", {nullable: false})
    blockHeight!: number

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("int4", {nullable: false})
    initialQuantity!: number

    @Column_("varchar", {length: 13, nullable: false})
    status!: OrderStatus
}
