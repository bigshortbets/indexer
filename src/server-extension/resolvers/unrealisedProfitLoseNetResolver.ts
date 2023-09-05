import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {Market, Position} from "../../model";

@ObjectType()
export class UnrealisedProfitLoseNetResult {
  @Field(() => Number, { nullable: false })
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
      let base : number
      if(market){
          base = market.contractUnit * market.initialMargin / market.maintenanceMargin;
      } else {
          throw new Error('Market is undefined')
      }

      if(market) {
          let allLongsPerUser = await manager.getRepository(Position).query(`
           SELECT SUM(p.quantity * (${market.latestOraclePrice} - p.price) * ${base}) AS short_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.short = '${who}'
             AND p.status = 'OPEN';
          `)
          let allShortsPerUser = await manager.getRepository(Position).query(
              `SELECT SUM(p.quantity * (p.price - ${market.latestOraclePrice}) * ${base}) AS long_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.long = '${who}'
             AND p.status = 'OPEN'`
          )
          const longs = BigInt(allLongsPerUser[0].long_sum === null ? 0 : allLongsPerUser[0].long_sum)
          const shorts = BigInt(allShortsPerUser[0].short_sum === null ? 0 : allShortsPerUser[0].short_sum)
          return  new UnrealisedProfitLoseNetResult({ value: (longs + shorts).toString()})
      } else {
          return new UnrealisedProfitLoseNetResult({value: "0"})
      }
  }
}