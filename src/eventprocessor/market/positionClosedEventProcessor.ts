import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionClosedEvent} from "../../types/events";
import {Position} from "../../model";
import {Item} from "../../processor";

export class PositionClosedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionClosed";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Position closed event')
        let e = new MarketPositionClosedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            await ctx.store.remove(Position, parsedEvent.positionId.toString())
        } else {
            throw new Error('Unsupported spec')
        }
    }

}