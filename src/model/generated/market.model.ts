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

    @Column_("int4", {nullable: false})
    lifetime!: number

    @Column_("int4", {nullable: false})
    initialMargin!: number

    @Column_("int4", {nullable: false})
    maintenanceMargin!: number

    @Column_("int4", {nullable: false})
    contractUnit!: number

    @Column_("int4", {nullable: false})
    blockHeight!: number

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dailyVolume!: bigint
}
