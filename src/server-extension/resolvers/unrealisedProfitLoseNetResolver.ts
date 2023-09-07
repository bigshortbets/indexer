import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {Market, Position} from "../../model";

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
      const manager = await this.tx()
      const market = await manager.getRepository(Market).findOneBy({id: marketId})
      if(market) {
          let allShortsPerUser = await manager.getRepository(Position).query(`
           SELECT SUM(p.quantity * (${market.latestOraclePrice} - p.price) * 100 * ${market.contractUnit} / ${market.initialMargin}) AS short_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.short = '${who}'
             AND p.status = 'OPEN';
          `)
          let allLongsPerUser = await manager.getRepository(Position).query(
              `SELECT SUM(p.quantity * (p.price - ${market.latestOraclePrice})  * 100 * ${market.contractUnit} / ${market.initialMargin}) AS long_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.long = '${who}'
             AND p.status = 'OPEN'`
          )
          const shortSum = allShortsPerUser[0] !== undefined ?
              BigInt(allShortsPerUser[0].short_sum.toString().split(".")[0]) : BigInt(0)
          const longSum = allLongsPerUser[0] !== undefined ?
              BigInt(allLongsPerUser[0].long_sum.toString().split(".")[0]) : BigInt(0)
          return  new UnrealisedProfitLoseNetResult({ value: (shortSum + longSum).toString()})
      } else {
          return new UnrealisedProfitLoseNetResult({value: "0"})
      }
  }
}