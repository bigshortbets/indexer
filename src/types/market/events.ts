import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v20 from '../v20'

export const marketCreated =  {
    name: 'Market.MarketCreated',
    /**
     * New Market created
     */
    v1: new EventType(
        'Market.MarketCreated',
        sts.struct({
            marketId: sts.bigint(),
            ticker: v1.BoundedVec,
            tickSize: sts.bigint(),
            /**
             * Block number that will expire given market
             */
            lifetime: sts.number(),
            initialMargin: v1.Percent,
            maintenanceMargin: v1.Percent,
            contractUnit: sts.number(),
        })
    ),
    /**
     * New Market created
     */
    v20: new EventType(
        'Market.MarketCreated',
        sts.struct({
            marketId: sts.bigint(),
            ticker: sts.bytes(),
            tickSize: sts.bigint(),
            /**
             * Block number that will expire given market
             */
            lifetime: sts.number(),
            initialMargin: v20.Percent,
            maintenanceMargin: v20.Percent,
            contractUnit: v20.ContractUnit,
        })
    ),
}

export const marketRemoved =  {
    name: 'Market.MarketRemoved',
    /**
     * Market has been closed and removed
     */
    v1: new EventType(
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
    v1: new EventType(
        'Market.OrderCreated',
        sts.struct({
            market: sts.bigint(),
            price: sts.bigint(),
            side: v1.OrderSide,
            quantity: sts.number(),
            who: v1.AccountId32,
            orderId: sts.bigint(),
        })
    ),
}

export const orderReduced =  {
    name: 'Market.OrderReduced',
    /**
     * Status of the order changed
     */
    v1: new EventType(
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
    v1: new EventType(
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
    v1: new EventType(
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
    v1: new EventType(
        'Market.PositionCreated',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            price: sts.bigint(),
            quantity: sts.number(),
            long: v1.AccountId32,
            short: v1.AccountId32,
        })
    ),
}

export const positionReduced =  {
    name: 'Market.PositionReduced',
    /**
     * Position reduced
     */
    v1: new EventType(
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
    v1: new EventType(
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
    v1: new EventType(
        'Market.PositionClosed',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const orderExtended =  {
    name: 'Market.OrderExtended',
    /**
     * Order has been extended
     */
    v13: new EventType(
        'Market.OrderExtended',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
            newOrderId: sts.bigint(),
            quantity: sts.number(),
        })
    ),
}
