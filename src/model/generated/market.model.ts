import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Market {
    constructor(props?: Partial<Market>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    ticker!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    tickSize!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    lifetime!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    initialMargin!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    maintenanceMargin!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    contractUnit!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockHeight!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dailyVolume!: bigint
}
