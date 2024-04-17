import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {Market} from "./market.model"
import {OrderSide} from "./_orderSide"

@Entity_()
export class AggregatedOrdersByPrice {
    constructor(props?: Partial<AggregatedOrdersByPrice>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    price!: bigint

    @BigIntColumn_({nullable: false})
    quantity!: bigint

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("varchar", {length: 5, nullable: false})
    side!: OrderSide
}
