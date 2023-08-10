import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Position } from '../../model'

// Define custom GraphQL ObjectType of the query result
@ObjectType()
export class  AggregatedMarketVolume{
    @Field(() => Number, { nullable: true })
    volume!: number
    constructor(props: Partial<AggregatedMarketVolume>) {
        Object.assign(this, props);
    }
}

@Resolver()
export class MarketVolume {
    // Set by depenency injection
    constructor(private tx: () => Promise<EntityManager>) {}

    @Query(() => [AggregatedMarketVolume])
    async aggregatedMarket24HVolumeQuery(
        @Arg("marketId") marketId : string)
        : Promise<AggregatedMarketVolume> {
        const manager = await this.tx()
        let query =
            `select SUM(p.price * p.quantity) as volume 
             from position p
             where p.market_id = '${marketId}' 
             and p.timestamp >= now() - interval '24 hours'
            `
        return await manager.getRepository(Position).query(query)
    }
}