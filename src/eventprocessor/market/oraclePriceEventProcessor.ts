import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOraclePriceEvent} from "../../types/events";
import {Market, OraclePrice} from "../../model";
import {Item} from "../../processor";

export class OraclePriceEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OraclePrice";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Oracle price event')
        let e = new MarketOraclePriceEvent(ctx, item.event)
        if (e.isV1) {
            let parsedEvent = e.asV1
            let oraclePrice = new OraclePrice({
                id: item.event.id,
                market: await ctx.store.get(Market, parsedEvent.market.toString()),
                price: parsedEvent.price,
                blockHeight: BigInt(block.header.height),
                timestamp: new Date(block.header.timestamp)
            })
            //UnrealizedPLNet.updateAfterOraclePriceChange(ctx.store, oraclePrice) // One or another: OraclePrice change or MarkedToMarket change
            await ctx.store.save(oraclePrice);
        } else {
            throw new Error('Unsupported spec')
        }
    }
}
