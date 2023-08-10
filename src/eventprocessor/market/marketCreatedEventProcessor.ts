import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketMarketCreatedEvent} from "../../types/events";
import {Market} from "../../model";
import {Item} from "../../processor";

export class MarketCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.MarketCreated";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Market created event')
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
                blockHeight: BigInt(block.header.height),
                timestamp: new Date(block.header.timestamp)
            }));
        } else {
            throw new Error('Unsupported spec')
        }
    }

}
