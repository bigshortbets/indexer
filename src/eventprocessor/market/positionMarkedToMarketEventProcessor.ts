import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketPositionMarkedToMarketEvent} from "../../types/events";
import {OraclePrice, Position} from "../../model";
import {Item} from "../../processor";

export class PositionMarkedToMarketEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.PositionMarkedToMarket";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) { // TODO: Możliwe że można wywalić: do ogarnięcia pod koniec projektu
        console.log('Position marked to marked event')
        let e = new MarketPositionMarkedToMarketEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            console.log(parsedEvent)
            let latestOraclePrice = await ctx.store.findOne(OraclePrice,
                {
                    where: {
                        market: {id: parsedEvent.market.toString()}
                    },
                    order: {
                        blockHeight: "DESC"
                    },
                    relations: {
                        market: true
                    }
                })
            if(!latestOraclePrice) {
                throw new Error('Oracle price not found')
            }
            let position = await ctx.store.findOne(Position, {where: {id: parsedEvent.positionId.toString()}, relations: {market: true}})
            if(!position) {
                throw new Error('Position not found')
            }
            position.price = latestOraclePrice.price
            await ctx.store.save(position)
        } else {
            throw new Error('Unsupported spec')
        }
    }

}