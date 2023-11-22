import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Market} from "./market.model"
import {PositionStatus} from "./_positionStatus"

@Entity_()
export class Position {
    constructor(props?: Partial<Position>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Market, {nullable: true})
    market!: Market

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false,})
    createPrice!: bigint;

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    quantity!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    quantityLeft!: bigint

    @Column_("text", {nullable: false})
    long!: string

    @Column_("text", {nullable: false})
    short!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockHeight!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("varchar", {length: 6, nullable: true})
    status!: PositionStatus | undefined | null
}