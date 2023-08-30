import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketMarketRemovedEvent} from "../../types/events";
import {Market, Order, OrderStatus} from "../../model";
import {Item} from "../../processor";

export class MarketRemovedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.MarketRemoved";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Market removed event')
        let e = new MarketMarketRemovedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let marketOrders = await ctx.store.count(
                Order,
        {where: { market: {id: parsedEvent.marketId.toString()}, status: OrderStatus.ACTIVE}}
            )
            if(marketOrders > 0) {
                throw new Error('There are still orders assigned to the market')
            }
            await ctx.store.remove(Market, parsedEvent.marketId.toString());
        } else {
            throw new Error('Unsupported spec')
        }
    }

}