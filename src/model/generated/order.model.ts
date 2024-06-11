import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigDecimalColumn as BigDecimalColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Market} from "./market.model"
import {OrderSide} from "./_orderSide"
import {OrderStatus} from "./_orderStatus"
import {OrderType, fromJsonOrderType} from "./_orderType"

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

    @BigDecimalColumn_({nullable: false})
    price!: BigDecimal

    @BigIntColumn_({nullable: false})
    quantity!: bigint

    @Column_("varchar", {length: 5, nullable: false})
    side!: OrderSide

    @StringColumn_({nullable: true})
    who!: string | undefined | null

    @BigIntColumn_({nullable: false})
    blockHeight!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    initialQuantity!: bigint

    @Column_("varchar", {length: 23, nullable: false})
    status!: OrderStatus

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonOrderType(obj)}, nullable: false})
    type!: OrderType
}
