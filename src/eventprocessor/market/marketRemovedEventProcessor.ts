import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {market} from "../../types/events";
import {EntityManager} from "typeorm";
import {DataHandlerContext, Block, Event} from "@subsquid/substrate-processor";


export class MarketRemovedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.MarketRemoved";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Market removed event')
        const marketRemovedEvent = market.marketRemoved.v1;
        if (marketRemovedEvent.is(event)) {
            let parsedEvent = marketRemovedEvent.decode(event);
            const em = (ctx.store as unknown as {em: () => EntityManager}).em
            await (await em()).query(
                `DELETE FROM "liquidation_price" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "aggregated_orders_by_price" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "position" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "order" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "market" WHERE id = '${parsedEvent.marketId}';
            `)
        } else {
            console.error('Unsupported spec')
        }
    }

}