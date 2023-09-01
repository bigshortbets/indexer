import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {EventProcessorProvider} from "./eventprocessor/eventProcessorProvider";
import {EntityManager} from "typeorm";

const processorProvider = new EventProcessorProvider();
let lastUpdateTime = -1;
processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            let processor = processorProvider.getProcessorByName(item.name);
            await processor?.process(ctx, block, item);
        }
    }

    if(ctx.isHead) {
        const now = Date.now();
        if(now - lastUpdateTime >= 1000 * 15) { // do envów
            lastUpdateTime = now
            await update24Volume(ctx.store);
        }
    }
})

async function update24Volume(store: Store) {
    console.log("24h volume update")
    const em = (store as unknown as {em: () => EntityManager}).em
    await (await em()).query(`UPDATE "market" AS m
                    SET "daily_volume" = (
                        SELECT COALESCE(SUM(p."price" * p."quantity" * m."contract_unit"), 0)
                        FROM "position" AS p
                        WHERE p."market_id" = m."id"
                            AND p."timestamp" >= NOW() - interval '1 day'
                    )
                    RETURNING m;`)
}