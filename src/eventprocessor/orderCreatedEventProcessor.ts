import {EventProcessor} from "./eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOrderCreatedEvent} from "../types/events";
import {Order} from "../model";

export class OrderCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OrderCreated";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, item: AddEventItem<any, any>) {
        let e = new MarketOrderCreatedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            await ctx.store.save(new Order({
                id: parsedEvent.orderId.toString(),
                // market: new Market(parsedEvent.market),
                price: parsedEvent.price,
                side: parsedEvent.side.toString(),
                quantity: BigInt(parsedEvent.quantity),
                who: parsedEvent.who.toString()
            }));
        } else {
            throw new Error('Unsupported spec')
        }
    }

}
