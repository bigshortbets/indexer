import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import {OraclePriceProvider} from "../../utils";

@ObjectType()
export class LatestOraclePrice {
    @Field(() => String, { nullable: false })
    value!: BigInt
    constructor(props: Partial<LatestOraclePrice>) {
        Object.assign(this, props);
    }
}

@Resolver()
export class OraclePriceResolver {
    @Query(() => LatestOraclePrice)
    async getLatestOraclePrice(@Arg('marketId', {nullable: false}) marketId: string)
        : Promise<LatestOraclePrice> {
        return new LatestOraclePrice({value: await OraclePriceProvider.getLatestOraclePriceForMarketId(marketId)})
    }
}