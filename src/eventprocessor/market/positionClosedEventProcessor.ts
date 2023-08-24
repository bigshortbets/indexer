import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionClosedEvent} from "../../types/events";
import {Position, PositionStatus} from "../../model";
import {Item} from "../../processor";
import {UnrealizedPLNet} from "./unrealizedPLNet";

export class PositionClosedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionClosed";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Position closed event')
        let e = new MarketPositionClosedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let position = await ctx.store.get(Position, parsedEvent.positionId.toString());
            if(position) {
                await UnrealizedPLNet.updateAfterPositionClosure(ctx.store, position)
                position.status = PositionStatus.CLOSED;
                await ctx.store.save(position);
            } else {
                throw new Error(`There is no position with id: ${parsedEvent.positionId}`)
            }
        } else {
            throw new Error('Unsupported spec')
        }
    }

}