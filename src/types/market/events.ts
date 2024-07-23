import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2 from '../v2'

export const marketCreated =  {
    name: 'Market.MarketCreated',
    /**
     * New Market created
     */
    v2: new EventType(
        'Market.MarketCreated',
        sts.struct({
            marketId: sts.bigint(),
            ticker: sts.bytes(),
            tickSize: sts.bigint(),
            /**
             * Block number that will expire given market
             */
            lifetime: sts.number(),
            initialMargin: v2.Percent,
            maintenanceMargin: v2.Percent,
            contractUnit: v2.ContractUnit,
        })
    ),
}

export const marketRemoved =  {
    name: 'Market.MarketRemoved',
    /**
     * Market has been closed and removed
     */
    v2: new EventType(
        'Market.MarketRemoved',
        sts.struct({
            marketId: sts.bigint(),
        })
    ),
}

export const orderCreated =  {
    name: 'Market.OrderCreated',
    /**
     * New Order settled
     */
    v2: new EventType(
        'Market.OrderCreated',
        sts.struct({
            market: sts.bigint(),
            price: sts.bigint(),
            side: v2.OrderSide,
            orderType: v2.OrderType,
            quantity: sts.number(),
            who: v2.AccountId32,
            orderId: sts.bigint(),
        })
    ),
}

export const orderExtended =  {
    name: 'Market.OrderExtended',
    /**
     * Order has been extended
     */
    v2: new EventType(
        'Market.OrderExtended',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
            newOrderId: sts.bigint(),
            newPositionId: sts.bigint(),
            quantity: sts.number(),
        })
    ),
}

export const orderReduced =  {
    name: 'Market.OrderReduced',
    /**
     * Status of the order changed
     */
    v2: new EventType(
        'Market.OrderReduced',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
            /**
             * New quantity of the order
             */
            quantity: sts.number(),
        })
    ),
}

export const orderFilled =  {
    name: 'Market.OrderFilled',
    /**
     * Entire order has been realized
     */
    v2: new EventType(
        'Market.OrderFilled',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
        })
    ),
}

export const orderCanceled =  {
    name: 'Market.OrderCanceled',
    /**
     * Order has been canceled
     */
    v2: new EventType(
        'Market.OrderCanceled',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
        })
    ),
}

export const positionCreated =  {
    name: 'Market.PositionCreated',
    /**
     * New position created
     */
    v2: new EventType(
        'Market.PositionCreated',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            price: sts.bigint(),
            quantity: sts.number(),
            long: v2.AccountId32,
            short: v2.AccountId32,
        })
    ),
}

export const positionReduced =  {
    name: 'Market.PositionReduced',
    /**
     * Position reduced
     */
    v2: new EventType(
        'Market.PositionReduced',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            quantity: sts.number(),
        })
    ),
}

export const positionMarkedToMarket =  {
    name: 'Market.PositionMarkedToMarket',
    /**
     * Position marked to market with oracle price
     */
    v2: new EventType(
        'Market.PositionMarkedToMarket',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            price: sts.bigint(),
        })
    ),
}

export const positionClosed =  {
    name: 'Market.PositionClosed',
    /**
     * Position closed
     */
    v2: new EventType(
        'Market.PositionClosed',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const marketClosed =  {
    name: 'Market.MarketClosed',
    /**
     * Market has been closed
     */
    v7: new EventType(
        'Market.MarketClosed',
        sts.struct({
            marketId: sts.bigint(),
        })
    ),
}
