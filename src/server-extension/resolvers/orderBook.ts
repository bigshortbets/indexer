import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Order } from '../../model'

// Define custom GraphQL ObjectType of the query result
@ObjectType()
export class GroupedOrder {
    @Field(() => Number, { nullable: true })
    quantity!: number

    @Field(() => Number, { nullable: true })
    price!: number

    constructor(props: Partial<GroupedOrder>) {
        Object.assign(this, props);
    }
}

@Resolver()
export class OrderBookResolver {
    // Set by depenency injection
    constructor(private tx: () => Promise<EntityManager>) {}

    @Query(() => [GroupedOrder])
    async orderBookQuery(
        @Arg("side") side: string,
        @Arg("marketId") marketId: string,
        @Arg("limit") limit: number)
        : Promise<GroupedOrder[]> {
        const manager = await this.tx()
        // execute custom SQL query
        let priceOrder: string
        if(side === 'Short') {
            priceOrder = 'DESC'
        } else {
            priceOrder = 'ASC'
        }

        let query = `select price, SUM(quantity) as quantity
             from "order"
             where "order".side = '${side}' 
             and "order".market_id = '${marketId}'
             group by price
             order by price ${priceOrder}
                 limit ${limit};`
        return await manager.getRepository(Order).query(query)
    }
}