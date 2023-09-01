import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionReducedEvent} from "../../types/events";
import {Position} from "../../model";
import {Item} from "../../processor";
import {LiquidationPriceCalculator} from "./liquidationPriceCalculator";

export class PositionsReducedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionReduced";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Position reduced event')
        let e = new MarketPositionReducedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let position = await ctx.store.findOne(Position,
                {
                    where: {
                        id: parsedEvent.positionId.toString()
                    },
                    relations: {market: true}
                })
            if(position) {
                const delta = BigInt(parsedEvent.quantity) - position.quantityLeft
                await LiquidationPriceCalculator.calculateLiquidationPrice(position, ctx.store, delta)
                position.quantityLeft = BigInt(parsedEvent.quantity)
                await ctx.store.save(position)
            } else {
                throw new Error('Position not found')
            }
        } else {
            throw new Error('Unsupported spec')
        }
    }

}