import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { market } from "../../types/events";
import { Market } from "../../model";
import { DataHandlerContext, Block, Event } from "@subsquid/substrate-processor";
import { encodeMarketTicker } from "../../utils/encodersUtils";

export class MarketCreatedEventProcessor implements EventProcessor {
    getHandledEventName(): string {
        return "Market.MarketCreated";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Market created event')
        const receivedEvent = market.marketCreated.v1;
        if (receivedEvent.is(event)) {
            const decodedEvent = receivedEvent.decode(event);
            const createdMarket = new Market({
                id: decodedEvent.marketId.toString(),
                ticker: encodeMarketTicker(decodedEvent.ticker),
                tickSize: BigInt(decodedEvent.tickSize),
                lifetime: BigInt(decodedEvent.lifetime),
                initialMargin: decodedEvent.initialMargin,
                maintenanceMargin: decodedEvent.maintenanceMargin,
                contractUnit: BigInt(decodedEvent.contractUnit),
                blockHeight: BigInt(block.header.height),
                // @ts-ignore
                timestamp: new Date(block.header.timestamp),
                dailyVolume: BigInt(0)
            })
            await ctx.store.save(createdMarket);
        } else {
            console.error("Unsupported spec");
        }

    }

}
