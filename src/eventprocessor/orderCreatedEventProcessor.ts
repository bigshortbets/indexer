import {EventProcessor} from "./eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOrderCreatedEvent} from "../types/events";
import {Market, Order} from "../model";
import * as ss58 from '@subsquid/ss58'
import {Item} from "../processor";

export class OrderCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OrderCreated";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        let e = new MarketOrderCreatedEvent(ctx, item.event)
        if (e.isV1) {
            const parsedEvent = e.asV1
            const market = ctx.store.get(Market, parsedEvent.market.toString());
            await ctx.store.save(new Order({
                id: parsedEvent.orderId.toString(),
                market: await market,
                price: parsedEvent.price,
                side: parsedEvent.side.__kind,
                quantity: BigInt(parsedEvent.quantity),
                who: ss58.codec(42).encode(parsedEvent.who),
            }));
        } else {
            throw new Error('Unsupported spec')
        }
    }

}
