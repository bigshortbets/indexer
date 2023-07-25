import {EventProcessor} from "./eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOrderReducedEvent} from "../types/events";
import {Order} from "../model";
import {Item} from "../processor";

export class OrderReducedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OrderReduced";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        let e = new MarketOrderReducedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let persistedOrder = await ctx.store.get(Order, parsedEvent.orderId.toString());
            if(persistedOrder !== undefined){
                persistedOrder.quantity = BigInt(parsedEvent.quantity);
            } else {
                throw  new Error("Order doesn't exist");
            }
            await ctx.store.save(persistedOrder);
        } else {
            throw new Error('Unsupported spec')
        }
    }
}