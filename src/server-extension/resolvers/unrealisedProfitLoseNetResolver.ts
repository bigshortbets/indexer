import {Arg, Field, ObjectType, Query, Resolver} from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {LatestOraclePrice, Market, Position} from "../../model";

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
      const latestOraclePrice = await manager.getRepository(LatestOraclePrice).findOneBy({id: marketId})

      const marketContractUnit = await manager.getRepository(Market).findOneBy({id: marketId})

      if(latestOraclePrice && marketContractUnit) {
          let allShortsPerUser = await manager.getRepository(Position).query(`
           SELECT SUM(p.quantity * (${latestOraclePrice.price} - p.price) * ${marketContractUnit.contractUnit}) AS short_sum
           FROM position AS p
           WHERE p.market_id = '${marketId}'
             AND p.short = '${who}'
             AND p.status = 'OPEN';
          `)
          let allLongsPerUser = await manager.getRepository(Position).query(
              `SELECT SUM(p.quantity * (p.price - ${latestOraclePrice.price}) * ${marketContractUnit.contractUnit}) AS long_sum
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