import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {market} from "../../types/events";
import {Market} from "../../model";
import {DataHandlerContext, Block, Event} from "@subsquid/substrate-processor";

export class MarketCreatedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.MarketCreated";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Market created event')
        const receivedEvent = market.marketCreated.v1;
        if(receivedEvent.is(event)) {
            const decodedEvent = receivedEvent.decode(event); // TODO: may be wrong type
            const createdMarket = new Market({
                id: decodedEvent.marketId.toString(),
                ticker: decodedEvent.ticker.toString(),
                tickSize: decodedEvent.tickSize,
                lifetime: BigInt(decodedEvent.lifetime),
                initialMargin: BigInt(decodedEvent.initialMargin),
                maintenanceMargin: BigInt(decodedEvent.maintenanceMargin),
                contractUnit: BigInt(decodedEvent.contractUnit),
                blockHeight: BigInt(block.header.height),
                // timestamp: new Date(block.header.timestamp), // TODO: how timestamp is propagated
                dailyVolume: BigInt(0)
            })
            await ctx.store.save(createdMarket);
        } else {
            console.error("Unsupported spec");
        }

    }

}
