import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOrderFilledEvent} from "../../types/events";
import {Order, OrderStatus} from "../../model";
import {Item} from "../../processor";
import {AggregatedOrdersHandler} from "./aggregatedOrdersHandler";

export class OrderFilledEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OrderFilled";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Order filled event')
        let e = new MarketOrderFilledEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let order = await ctx.store.findOne(Order, {where: {id: parsedEvent.orderId.toString()}, relations: {market: true}});
            if(order) {
                await AggregatedOrdersHandler.removeOrderFromAggregatedOrders(ctx.store, order)
                order.status = OrderStatus.FINALIZED
                await ctx.store.save(order);
            }
        } else {
            throw new Error('Unsupported spec')
        }
    }
}