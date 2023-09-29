import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketMarketRemovedEvent} from "../../types/events";
import {Market} from "../../model";
import {Item} from "../../processor";
import {EntityManager} from "typeorm";

export class MarketRemovedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.MarketRemoved";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Market removed event')
        let e = new MarketMarketRemovedEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            const em = (ctx.store as unknown as {em: () => EntityManager}).em
            await (await em()).query(
                `DELETE FROM "liquidation_price" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "aggregated_orders_by_price" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "position" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "order" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "market" WHERE id = '${parsedEvent.marketId}';
            `)
        } else {
            throw new Error('Unsupported spec')
        }
    }

}