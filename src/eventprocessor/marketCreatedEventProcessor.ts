import {EventProcessor} from "./eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketMarketCreatedEvent} from "../types/events";
import {Market} from "../model";

export class MarketCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.MarketCreated";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, item: AddEventItem<any, any>) {
        let e = new MarketMarketCreatedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            await ctx.store.save(new Market({
                id: parsedEvent.marketId.toString(),
                ticker: parsedEvent.ticker.toString(),
                tickSize: parsedEvent.tickSize,
                lifetime: BigInt(parsedEvent.lifetime),
                initialMargin: BigInt(parsedEvent.marketId),
                maintananceMargin: BigInt(parsedEvent.marketId),
                contractUnit: BigInt(parsedEvent.marketId),
            }));
        } else {
            throw new Error('Unsupported spec')
        }
    }

}
