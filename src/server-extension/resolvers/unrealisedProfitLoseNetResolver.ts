import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {Market, Position} from "../../model";
import {OraclePriceProvider} from "../../utils";

@ObjectType()
export class UnrealisedProfitLoseNetResult {
  @Field(() => String, { nullable: false })
  value!: string
  constructor(props: Partial<UnrealisedProfitLoseNetResult>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class UnrealisedProfitLoseNetResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => UnrealisedProfitLoseNetResult)
  async calculateUnrealisedPLNetPerUser(@Arg('who', {nullable: false}) who: string,
                                        @Arg('marketId', {nullable: false}) marketId: string)
      : Promise<UnrealisedProfitLoseNetResult> {
      if (marketId.length == 0) {
          throw new Error('MarketId is empty')
      }
      if (who.length == 0) {
          throw new Error('Who is empty')
      }
      const manager = await this.tx()
      const market = await manager.getRepository(Market).findOneBy({id: marketId})
      const latestOraclePrice = await OraclePriceProvider.getLatestOraclePriceForMarketId(marketId)
      if(market) {
          let allShortsPerUser = await manager.getRepository(Position).query(`
           SELECT SUM(p.quantity_left * (p.price - ${latestOraclePrice}) * ${market.contractUnit}) AS short_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.short = '${who}'
             AND p.status = 'OPEN';
          `)
          let allLongsPerUser = await manager.getRepository(Position).query(
              `SELECT SUM(p.quantity_left * (${latestOraclePrice} - p.price) * ${market.contractUnit}) AS long_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.long = '${who}'
             AND p.status = 'OPEN'`
          )
          console.log(allLongsPerUser[0], allShortsPerUser[0])
          const shortSum = BigInt(allShortsPerUser[0]?.short_sum || 0)
          const longSum = BigInt(allLongsPerUser[0]?.long_sum || 0)
          console.log(shortSum, longSum)
          return  new UnrealisedProfitLoseNetResult({ value: (shortSum + longSum).toString()})
      } else {
          return new UnrealisedProfitLoseNetResult({value: "0"})
      }
  }
}