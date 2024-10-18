import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v2 from '../v2'
import * as v6 from '../v6'

export const createOrder =  {
    name: 'Market.create_order',
    /**
     * Create new order
     */
    v2: new CallType(
        'Market.create_order',
        sts.struct({
            market: sts.bigint(),
            price: sts.bigint(),
            quantity: sts.number(),
            side: v2.OrderSide,
        })
    ),
}

export const cancelOrder =  {
    name: 'Market.cancel_order',
    /**
     * Cancel order and refund locked funds
     */
    v2: new CallType(
        'Market.cancel_order',
        sts.struct({
            market: sts.bigint(),
            orderId: sts.bigint(),
        })
    ),
}

export const closePosition =  {
    name: 'Market.close_position',
    /**
     * Settle closing order
     */
    v2: new CallType(
        'Market.close_position',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            price: sts.bigint(),
            quantity: sts.number(),
        })
    ),
}

export const createPosition =  {
    name: 'Market.create_position',
    /**
     * Settle a position between given order sides
     */
    v2: new CallType(
        'Market.create_position',
        sts.struct({
            market: sts.bigint(),
            sellerId: sts.bigint(),
            buyerId: sts.bigint(),
        })
    ),
}

export const createMarket =  {
    name: 'Market.create_market',
    /**
     * Create new market
     */
    v2: new CallType(
        'Market.create_market',
        sts.struct({
            ticker: sts.string(),
            tickSize: sts.bigint(),
            lifetime: sts.number(),
            initialMargin: sts.number(),
            maintenanceMargin: sts.number(),
            contractUnit: v2.ContractUnit,
        })
    ),
}

export const deleteMarket =  {
    name: 'Market.delete_market',
    /**
     * Delete closed market
     */
    v2: new CallType(
        'Market.delete_market',
        sts.struct({
            market: sts.bigint(),
        })
    ),
}

export const oraclePrice =  {
    name: 'Market.oracle_price',
    /**
     * Submit new oracle price
     */
    v2: new CallType(
        'Market.oracle_price',
        sts.struct({
            market: sts.bigint(),
            price: sts.bigint(),
        })
    ),
}

export const feedOracleValues =  {
    name: 'Market.feed_oracle_values',
    /**
     * Feed the external oracle values.
     * 
     * Require authorized operator.
     */
    v2: new CallType(
        'Market.feed_oracle_values',
        sts.struct({
            values: sts.array(() => sts.tuple(() => [sts.bigint(), sts.bigint()])),
        })
    ),
}

export const markToMarket =  {
    name: 'Market.mark_to_market',
    /**
     * Mark to market positon with oracle price
     */
    v2: new CallType(
        'Market.mark_to_market',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const liquidatePosition =  {
    name: 'Market.liquidate_position',
    /**
     * Liquidate position of an user that has not sufficient margin
     */
    v2: new CallType(
        'Market.liquidate_position',
        sts.struct({
            market: sts.bigint(),
            positionId: sts.bigint(),
            orderId: sts.bigint(),
        })
    ),
}

export const deposit =  {
    name: 'Market.deposit',
    /**
     * Deposit additional funds for margin on given market
     */
    v2: new CallType(
        'Market.deposit',
        sts.struct({
            market: sts.bigint(),
            amount: sts.bigint(),
        })
    ),
}

export const withdraw =  {
    name: 'Market.withdraw',
    /**
     * Withdraw reduntant funds from given market
     */
    v2: new CallType(
        'Market.withdraw',
        sts.struct({
            market: sts.bigint(),
            amount: sts.option(() => sts.bigint()),
        })
    ),
}

export const createOrderWithMargin =  {
    name: 'Market.create_order_with_margin',
    /**
     * Create new order with margin
     */
    v6: new CallType(
        'Market.create_order_with_margin',
        sts.struct({
            market: sts.bigint(),
            price: sts.bigint(),
            quantity: sts.number(),
            side: v6.OrderSide,
            margin: sts.number(),
        })
    ),
}

export const closeMarket =  {
    name: 'Market.close_market',
    /**
     * Early close market
     */
    v7: new CallType(
        'Market.close_market',
        sts.struct({
            market: sts.bigint(),
        })
    ),
}
