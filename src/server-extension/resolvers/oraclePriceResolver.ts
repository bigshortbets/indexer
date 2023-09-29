import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import {OraclePriceProvider} from "../../utils";

@ObjectType()
export class LatestOraclePrice {
    @Field(() => String, { nullable: false })
    price!: BigInt
    constructor(props: Partial<LatestOraclePrice>) {
        Object.assign(this, props);
    }
}

@Resolver()
export class OraclePriceResolver {
    @Query(() => LatestOraclePrice)
    async getLatestOraclePrice(@Arg('marketId', {nullable: false}) marketId: string)
        : Promise<LatestOraclePrice> {
        if (marketId.length == 0) {
            throw new Error('MarketId is empty')
        }
        return new LatestOraclePrice({price: await OraclePriceProvider.getLatestOraclePriceForMarketId(marketId)})
    }
}