import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {Position, PositionStatus} from "../../model";
import * as events from "../../types/events";
import {DataHandlerContext, Block, Event} from "@subsquid/substrate-processor";
export class PositionClosedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.PositionClosed";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Position closed event')
        const positionClosedEvent = events.market.positionClosed.v1;
        if (positionClosedEvent.is(event)) {
            let parsedEvent = positionClosedEvent.decode(event);
            let position = await ctx.store.findOne(Position,
                {
                    where: {
                        id: parsedEvent.positionId.toString()
                    },
                    relations: {market: true}
                })
            if(position) {
                position.quantityLeft = BigInt(0)
                position.status = PositionStatus.CLOSED;
                await ctx.store.save(position);
            } else {
                console.warn(`There is no position with id: ${parsedEvent.positionId}`)
            }
        } else {
            console.error('Unsupported spec')
        }
    }

}