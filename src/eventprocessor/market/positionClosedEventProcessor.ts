import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionClosedEvent} from "../../types/events";
import {Position, PositionStatus} from "../../model";
import {Item} from "../../processor";
import {LiquidationPriceCalculator} from "./liquidationPriceCalculator";

export class PositionClosedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionClosed";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Position closed event')
        let e = new MarketPositionClosedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            console.log(parsedEvent)
            let position = await ctx.store.findOne(Position,
                {
                    where: {
                        id: parsedEvent.positionId.toString()
                    },
                    relations: {market: true}
                })
            if(position) {
                const delta = - position.quantityLeft
                console.log("calculateLiqudationPrice: ", position, "delta: ", delta)
                await LiquidationPriceCalculator.calculate(position, ctx.store, delta)
                position.quantityLeft = BigInt(0)
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