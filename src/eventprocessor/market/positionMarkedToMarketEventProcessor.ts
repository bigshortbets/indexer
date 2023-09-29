import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {Position} from "../../model";
import {Item} from "../../processor";
import {MarketPositionMarkedToMarketEvent} from "../../types/events";

export class PositionMarkedToMarketEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionMarkedToMarket";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) { // TODO: Możliwe że można wywalić: do ogarnięcia pod koniec projektu
        console.log('Position marked to marked event')
        let e = new MarketPositionMarkedToMarketEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let position = await ctx.store.findOne(Position, {
                where: {
                    id: parsedEvent.positionId.toString(),
                    market: {id: parsedEvent.market.toString()}
                },
                relations: {market: true}
            })
            if(position) {
                position.price = parsedEvent.price;
                await ctx.store.save(position)
            } else {
                console.warn('Position not found')
            }
        } else {
            throw new Error('Unsupported spec')
        }
    }

}