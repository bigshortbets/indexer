import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {Market} from './model'
import {ProcessorContext, processor} from './processor'
import {MarketMarketCreatedEvent} from './types/events'

processor.run(new TypeormDatabase(), async (ctx) => {
    let markets = getMarkets(ctx)
    console.log(markets);
    await ctx.store.save(markets);
})

function getMarkets(ctx: ProcessorContext<Store>): Market[] {
    let markets: Market[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == 'Market.MarketCreated') {
                let e = new MarketMarketCreatedEvent(ctx, item.event)
                let rec: {marketId: bigint, ticker: Uint8Array, tickSize: bigint, lifetime: number, initialMargin: number, maintananceMargin: number, contractUnit: number}
                if (e.isV1) {
                    let {marketId, ticker, tickSize, lifetime, initialMargin, maintananceMargin, contractUnit} = e.asV1
                    rec = {marketId, ticker, tickSize, lifetime, initialMargin, maintananceMargin, contractUnit}
                } else {
                    throw new Error('Unsupported spec')
                }

                markets.push(new Market({
                    id: rec.marketId.toString(),
                    ticker: rec.ticker.toString()
                }))
            }
        }
    }
    return markets
}
