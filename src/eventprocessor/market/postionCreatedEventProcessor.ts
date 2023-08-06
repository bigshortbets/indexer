import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionCreatedEvent} from "../../types/events";
import {Market, Position} from "../../model";
import * as ss58 from '@subsquid/ss58'
import {Item} from "../../processor";

export class PositionCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionCreated";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Position created event')
        let e = new MarketPositionCreatedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            await ctx.store.save(new Position({
                id: parsedEvent.positionId.toString(),
                market: await ctx.store.get(Market, parsedEvent.market.toString()),
                price: parsedEvent.price,
                quantity: BigInt(parsedEvent.quantity),
                long: ss58.codec(42).encode(parsedEvent.long),
                short: ss58.codec(42).encode(parsedEvent.short),
                blockHeight: BigInt(block.header.height),
                timestamp: new Date(block.header.timestamp)
            }));
        } else {
            throw new Error('Unsupported spec')
        }
    }

}