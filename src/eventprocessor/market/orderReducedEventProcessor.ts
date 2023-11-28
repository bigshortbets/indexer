import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {Order} from "../../model";
import {AggregatedOrdersHandler} from "./aggregatedOrdersHandler";
import {DataHandlerContext, Block, Event} from "@subsquid/substrate-processor";
import * as events from "../../types/events"
export class OrderReducedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.OrderReduced";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Order reduced event')
        const orderReducedEvent = events.market.orderReduced.v1;
        if (orderReducedEvent.is(event)) {
            let parsedEvent = orderReducedEvent.decode(event)
            let persistedOrder = await ctx.store.findOne(
                Order,
                {where: {id : parsedEvent.orderId.toString()}, relations: {market: true}});
            if(persistedOrder !== undefined){
                let quantityDelta = persistedOrder.quantity - parsedEvent.quantity
                await AggregatedOrdersHandler.removeQuantityFromAggregatedOrders(ctx.store, persistedOrder, quantityDelta)
                persistedOrder.quantity = parsedEvent.quantity;
                await ctx.store.save(persistedOrder);
            } else {
                console.warn("Order doesn't exist");
            }
        } else {
            console.error('Unsupported spec')
        }
    }
}